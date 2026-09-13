import { app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import crypto from "crypto";


export interface RenderPdfResult
{
	filePath: string;
	buffer: Buffer;
}

function sanitizeBaseFileName(name?: string): string
{
	if (!name || !name.trim())
	{
		return "مستند";
	}
	const parsed = path.parse(name.trim()).name;
	// Remove invalid filesystem characters: \ / : * ? " < > |
	const cleaned = parsed.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_").trim();
	return cleaned || "مستند";
}

export async function renderHtmlToPdf(htmlContent: string, fileName?: string): Promise<RenderPdfResult>
{
	const tempDir = app.getPath("temp");
	const uniqueId = crypto.randomUUID();
	const baseName = sanitizeBaseFileName(fileName);

	const tempHtmlPath = path.join(tempDir, `${ baseName }_${ uniqueId }.html`);
	const outputPdfPath = path.join(tempDir, `${ baseName }_${ uniqueId }.pdf`);

	fs.writeFileSync(tempHtmlPath, htmlContent, "utf8");

	const printWin = new BrowserWindow({
		width: 800,
		height: 1130,
		show: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: false,
			allowRunningInsecureContent: true
		}
	});

	try
	{
		await printWin.loadFile(tempHtmlPath);

		// Wait for fonts and DOM rendering to settle
		await printWin.webContents.executeJavaScript(`
			new Promise((resolve) => {
				const check = () => {
					if (document.readyState === "complete" && (!document.fonts || document.fonts.status === 'loaded')) {
						resolve(true);
					} else {
						setTimeout(check, 50);
					}
				};
				check();
			})
		`);

		try
		{
			if (!printWin.webContents.debugger.isAttached())
			{
				printWin.webContents.debugger.attach("1.3");
			}
			await printWin.webContents.debugger.sendCommand("Emulation.setEmulatedMedia", {media: "screen"});
		}
		catch (debugErr)
		{
			console.warn("[PDF Renderer] Debugger emulation warning:", debugErr);
		}

		await new Promise((resolve) => setTimeout(resolve, 300));

		const pdfData = await printWin.webContents.printToPDF({
			pageSize: "A4",
			printBackground: true,
			margins: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			}
		});

		const pdfBuffer = Buffer.from(pdfData);

		return {
			filePath: outputPdfPath,
			buffer: pdfBuffer
		};
	}
	finally
	{
		// Clean up window resources
		if (!printWin.isDestroyed())
		{
			printWin.close();
		}

		// Delete temporary HTML file from disk
		try
		{
			if (fs.existsSync(tempHtmlPath))
			{
				fs.unlinkSync(tempHtmlPath);
			}
		}
		catch (cleanErr)
		{
			console.warn("[PDF Renderer] Failed to delete temp HTML file:", cleanErr);
		}
	}
}