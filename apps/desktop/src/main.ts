import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import makeWASocket, {
	Browsers,
	DisconnectReason,
	fetchLatestBaileysVersion,
	useMultiFileAuthState,
	WASocket
} from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";
import { renderHtmlToPdf } from "./pdfRenderer";

// Ensure single instance lock to prevent session file corruption
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock)
{
	app.quit();
}

// Set formal application identity for Windows Taskbar & Jump Lists
app.setName("يُسر");
app.setAppUserModelId("com.yusr.erp");

let mainWindow: BrowserWindow | null = null;
let waSocket: WASocket | null = null;
let isConnected = false;
let currentPhone: string | undefined = undefined;
let latestQrBase64: string | null = null;
let isConnecting = false;
let reconnectTimeout: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;

const MAX_RECONNECT_DELAY_MS = 30000;
const INITIAL_RECONNECT_DELAY_MS = 2000;
const sessionDir = path.join(app.getPath("userData"), "whatsapp_auth");

// Use local Vite dev server in development, production cloud URL when packaged
const DEFAULT_ERP_URL = app.isPackaged ? "https://erp.yusrsys.com" : "http://localhost:5173";

function hasSavedSession(): boolean
{
	const credsFile = path.join(sessionDir, "creds.json");
	if (!fs.existsSync(credsFile)) return false;
	try
	{
		const content = JSON.parse(fs.readFileSync(credsFile, "utf-8"));
		return Boolean(content.me || content.registered);
	}
	catch
	{
		return false;
	}
}

function cleanupSocket()
{
	if (reconnectTimeout)
	{
		clearTimeout(reconnectTimeout);
		reconnectTimeout = null;
	}
	if (waSocket)
	{
		try
		{
			waSocket.ev.removeAllListeners("connection.update");
			waSocket.ev.removeAllListeners("creds.update");
			waSocket.end(undefined);
		}
		catch (e)
		{
			console.warn("[WhatsApp] Cleanup warning:", e);
		}
		waSocket = null;
	}
}

function sanitizePhoneNumber(raw: string): string
{
	let cleaned = raw.replace(/\D/g, "");
	// Normalize local Saudi Arabia phone numbers (e.g. 05XXXXXXXX -> 9665XXXXXXXX)
	if (cleaned.startsWith("00"))
	{
		cleaned = cleaned.substring(2);
	}
	if (cleaned.startsWith("05") && cleaned.length === 10)
	{
		cleaned = `966${ cleaned.substring(1) }`;
	}
	else if (cleaned.startsWith("5") && cleaned.length === 9)
	{
		cleaned = `966${ cleaned }`;
	}
	return cleaned;
}

async function initWhatsApp(onQr?: (qrBase64: string) => void)
{
	if (isConnected || isConnecting)
	{
		return;
	}
	isConnecting = true;

	if (reconnectTimeout)
	{
		clearTimeout(reconnectTimeout);
		reconnectTimeout = null;
	}

	cleanupSocket();

	try
	{
		if (!fs.existsSync(sessionDir))
		{
			fs.mkdirSync(sessionDir, {recursive: true});
		}

		const {state, saveCreds} = await useMultiFileAuthState(sessionDir);
		const {version} = await fetchLatestBaileysVersion();

		waSocket = makeWASocket({
			auth: state,
			version,
			logger: pino({level: "silent"}) as any,
			printQRInTerminal: false,
			browser: Browsers.windows("Desktop"),
			syncFullHistory: false,
			connectTimeoutMs: 60000,
			defaultQueryTimeoutMs: 60000,
			keepAliveIntervalMs: 25000
		});

		waSocket.ev.on("creds.update", saveCreds);

		waSocket.ev.on("connection.update", async (update) =>
		{
			const {connection, lastDisconnect, qr} = update;

			if (qr)
			{
				try
				{
					const qrBase64 = (await QRCode.toDataURL(qr)).split(",")[1];
					if (qrBase64)
					{
						latestQrBase64 = qrBase64;
						onQr?.(qrBase64);
						mainWindow?.webContents.send("whatsapp:qr", qrBase64);
					}
				}
				catch (err)
				{
					console.error("[WhatsApp] Failed to generate QR code:", err);
				}
			}

			if (connection === "open")
			{
				isConnected = true;
				isConnecting = false;
				latestQrBase64 = null;
				reconnectAttempts = 0;
				currentPhone = waSocket?.user?.id?.split(":")[0] || waSocket?.user?.id?.split("@")[0];
				mainWindow?.webContents.send("whatsapp:status-changed", {
					isConnected: true,
					phoneNumber: currentPhone
				});
				console.log(`[WhatsApp] Connected successfully as: ${ currentPhone }`);
			}
			else if (connection === "close")
			{
				isConnected = false;
				isConnecting = false;

				const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
				const isLoggedOut = statusCode === DisconnectReason.loggedOut;
				const isRestartRequired = statusCode === DisconnectReason.restartRequired;

				mainWindow?.webContents.send("whatsapp:status-changed", {isConnected: false});

				if (isLoggedOut)
				{
					console.log("[WhatsApp] Device logged out. Purging session directory.");
					cleanupSocket();
					currentPhone = undefined;
					latestQrBase64 = null;
					reconnectAttempts = 0;
					if (fs.existsSync(sessionDir))
					{
						fs.rmSync(sessionDir, {recursive: true, force: true});
					}
				}
				else if (isRestartRequired)
				{
					console.log("[WhatsApp] Restart required by server. Reconnecting immediately...");
					cleanupSocket();
					void initWhatsApp(onQr);
				}
				else
				{
					reconnectAttempts++;
					const delay = Math.min(
						INITIAL_RECONNECT_DELAY_MS * Math.pow(1.5, reconnectAttempts - 1),
						MAX_RECONNECT_DELAY_MS
					);
					console.log(`[WhatsApp] Connection dropped (${ statusCode || "unknown" }). Reconnecting in ${ Math.round(delay / 1000) }s (Attempt ${ reconnectAttempts })...`);

					if (!reconnectTimeout)
					{
						reconnectTimeout = setTimeout(() =>
						{
							reconnectTimeout = null;
							void initWhatsApp(onQr);
						}, delay);
					}
				}
			}
		});
	}
	catch (err)
	{
		isConnecting = false;
		console.error("[WhatsApp] Initialization error:", err);
	}
}

function createWindow()
{
	const iconPath = app.isPackaged
		? path.join(process.resourcesPath, "build", "icon.ico")
		: path.join(__dirname, "..", "build", "icon.ico");

	mainWindow = new BrowserWindow({
		title: "يُسر",
		icon: fs.existsSync(iconPath) ? iconPath : undefined,
		width: 1366,
		height: 850,
		minWidth: 1024,
		minHeight: 700,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false
		}
	});

	// Normalize User-Agent to standard Chromium (remove "Electron/X.X.X") to prevent Google OAuth 403: disallowed_useragent
	const cleanUserAgent = mainWindow.webContents.userAgent.replace(/Electron\/\S+\s?/, "");
	mainWindow.webContents.userAgent = cleanUserAgent;

	// Ensure any child popup window (such as Google Sign-in) also uses the clean User-Agent
	mainWindow.webContents.on("did-create-window", (childWindow) =>
	{
		childWindow.webContents.userAgent = cleanUserAgent;
	});

	// Synchronize window title whenever document.title updates
	mainWindow.webContents.on("page-title-updated", (event, title) =>
	{
		event.preventDefault();
		mainWindow?.setTitle(title);
	});

	// Keyboard shortcuts: DevTools (F12, Ctrl+Shift+I) and Page Reload (F5, Ctrl+R)
	mainWindow.webContents.on("before-input-event", (event, input) =>
	{
		if (input.type === "keyDown")
		{
			// 1. Toggle DevTools (F12 or Ctrl + Shift + I)
			if (input.key === "F12" || (input.control && input.shift && input.key.toLowerCase() === "i"))
			{
				mainWindow?.webContents.toggleDevTools();
				event.preventDefault();
			}
			// 2. Refresh page (F5 or Ctrl + R)
			else if (input.key === "F5" || (input.control && !input.shift && input.key.toLowerCase() === "r"))
			{
				mainWindow?.webContents.reload();
				event.preventDefault();
			}
		}
	});

	const targetUrl = process.env.ERP_URL || DEFAULT_ERP_URL;
	mainWindow.loadURL(targetUrl);

	mainWindow.webContents.setWindowOpenHandler(({url}) =>
	{
		// Allow Google Sign-In popups to open as linked in-app child windows so OAuth postMessage can resolve
		if (
			url.startsWith("https://accounts.google.com") ||
			url.startsWith("https://accounts.youtube.com")
		)
		{
			return {
				action: "allow",
				overrideBrowserWindowOptions: {
					parent: mainWindow ?? undefined,
					modal: false,
					autoHideMenuBar: true,
					webPreferences: {
						nodeIntegration: false,
						contextIsolation: true
					}
				}
			};
		}

		// Open standard external links in default system browser
		if (url.startsWith("http://") || url.startsWith("https://"))
		{
			void shell.openExternal(url);
		}
		return {action: "deny"};
	});

	mainWindow.on("closed", () =>
	{
		mainWindow = null;
	});
}

// Single instance event handling: restore window if second instance is launched
app.on("second-instance", () =>
{
	if (mainWindow)
	{
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	}
});

app.whenReady().then(() =>
{
	createWindow();

	if (hasSavedSession())
	{
		console.log("[WhatsApp] Stored session detected. Restoring connection...");
		void initWhatsApp();
	}

	ipcMain.handle("whatsapp:get-status", async () =>
	{
		if (isConnected)
		{
			return {isConnected: true, phoneNumber: currentPhone};
		}
		if (hasSavedSession())
		{
			if (!waSocket && !isConnecting)
			{
				void initWhatsApp();
			}
			const start = Date.now();
			while (Date.now() - start < 5000)
			{
				if (isConnected)
				{
					return {isConnected: true, phoneNumber: currentPhone};
				}
				await new Promise((r) => setTimeout(r, 200));
			}
		}
		return {
			isConnected,
			phoneNumber: currentPhone
		};
	});

	ipcMain.handle("whatsapp:connect", async (event) =>
	{
		if (isConnected)
		{
			return {isConnected: true, phoneNumber: currentPhone};
		}

		if (!waSocket && !isConnecting)
		{
			void initWhatsApp((qr) =>
			{
				event.sender.send("whatsapp:qr", qr);
			});
		}

		if (latestQrBase64)
		{
			return {qrCodeBase64: latestQrBase64};
		}

		return new Promise((resolve) =>
		{
			const checkInterval = setInterval(() =>
			{
				if (latestQrBase64)
				{
					clearInterval(checkInterval);
					resolve({qrCodeBase64: latestQrBase64});
				}
				else if (isConnected)
				{
					clearInterval(checkInterval);
					resolve({isConnected: true, phoneNumber: currentPhone});
				}
			}, 400);

			setTimeout(() =>
			{
				clearInterval(checkInterval);
				resolve({qrCodeBase64: latestQrBase64, isConnected});
			}, 15000);
		});
	});

	ipcMain.handle("whatsapp:disconnect", async () =>
	{
		cleanupSocket();
		isConnected = false;
		currentPhone = undefined;
		latestQrBase64 = null;
		reconnectAttempts = 0;

		if (fs.existsSync(sessionDir))
		{
			fs.rmSync(sessionDir, {recursive: true, force: true});
		}

		mainWindow?.webContents.send("whatsapp:status-changed", {isConnected: false});
		return {success: true};
	});

	ipcMain.handle("whatsapp:send-invoice", async (_event, payload) =>
	{
		const {phoneNumber, message, htmlContent, fileName} = payload;

		if (!waSocket || !isConnected)
		{
			throw new Error("تطبيق الواتساب غير متصل حالياً. يرجى التأكد من ربط الحساب أولاً.");
		}

		if (!htmlContent || typeof htmlContent !== "string")
		{
			throw new Error("محتوى الفاتورة غير صالح.");
		}

		const sanitizedPhone = sanitizePhoneNumber(phoneNumber || "");
		if (sanitizedPhone.length < 8)
		{
			throw new Error("رقم الهاتف غير صالح. يرجى التأكد من كتابة الرقم بشكل صحيح.");
		}

		const jid = `${ sanitizedPhone }@s.whatsapp.net`;
		const resolvedFileName = fileName || "فاتورة.pdf";
		const pdfResult = await renderHtmlToPdf(htmlContent, resolvedFileName);

		await waSocket.sendMessage(jid, {
			document: pdfResult.buffer,
			mimetype: "application/pdf",
			fileName: resolvedFileName,
			caption: message || ""
		});

		return {success: true};
	});
});

app.on("window-all-closed", () =>
{
	cleanupSocket();
	app.quit();
});

app.on("before-quit", () =>
{
	cleanupSocket();
});