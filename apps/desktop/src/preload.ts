import { contextBridge, ipcRenderer, webFrame } from "electron";


let zoomBadgeTimeout: ReturnType<typeof setTimeout> | null = null;

// Helper to show floating zoom badge (like Chrome/Edge)
function showZoomBadge(zoomFactor: number)
{
	const parent = document.body || document.documentElement;
	if (!parent) return;

	let badge = document.getElementById("electron-zoom-badge");
	if (!badge)
	{
		badge = document.createElement("div");
		badge.id = "electron-zoom-badge";
		Object.assign(badge.style, {
			position: "fixed",
			top: "20px",
			right: "20px",
			zIndex: "999999999",
			backgroundColor: "rgba(15, 23, 42, 0.85)",
			color: "#ffffff",
			fontFamily: "system-ui, -apple-system, sans-serif",
			fontSize: "13px",
			fontWeight: "600",
			padding: "6px 14px",
			borderRadius: "20px",
			boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
			pointerEvents: "none",
			backdropFilter: "blur(8px)",
			WebkitBackdropFilter: "blur(8px)",
			border: "1px solid rgba(255, 255, 255, 0.15)",
			transition: "opacity 0.25s ease, transform 0.25s ease",
			opacity: "0",
			transform: "translateY(-6px) scale(0.95)"
		});
		parent.appendChild(badge);
	}

	// Update percentage text
	badge.textContent = `${ Math.round(zoomFactor * 100) }%`;
	badge.style.opacity = "1";
	badge.style.transform = "translateY(0) scale(1)";

	// Reset fade-out timer
	if (zoomBadgeTimeout)
	{
		clearTimeout(zoomBadgeTimeout);
	}

	zoomBadgeTimeout = setTimeout(() =>
	{
		if (badge)
		{
			badge.style.opacity = "0";
			badge.style.transform = "translateY(-6px) scale(0.95)";
		}
	}, 1500);
}

// Helper to safely apply zoom and trigger badge
function applyZoom(newZoom: number)
{
	const clampedZoom = Math.min(Math.max(newZoom, 0.5), 2.5); // 50% to 250%
	const roundedZoom = Math.round(clampedZoom * 100) / 100;
	webFrame.setZoomFactor(roundedZoom);
	showZoomBadge(roundedZoom);
}

// 1. Ctrl + Scroll
window.addEventListener(
	"wheel",
	(event) =>
	{
		if (event.ctrlKey)
		{
			event.preventDefault();
			const currentZoom = webFrame.getZoomFactor();
			const step = event.deltaY < 0 ? 0.05 : -0.05;
			applyZoom(currentZoom + step);
		}
	},
	{passive: false}
);

// 2. Keyboard shortcuts (Ctrl + Plus, Ctrl + Minus, Ctrl + 0)
window.addEventListener("keydown", (event) =>
{
	if (event.ctrlKey)
	{
		if (event.key === "=" || event.key === "+")
		{
			event.preventDefault();
			applyZoom(webFrame.getZoomFactor() + 0.1);
		}
		else if (event.key === "-")
		{
			event.preventDefault();
			applyZoom(webFrame.getZoomFactor() - 0.1);
		}
		else if (event.key === "0")
		{
			event.preventDefault();
			applyZoom(1.0); // Reset to 100%
		}
	}
});

// 3. Desktop API
contextBridge.exposeInMainWorld("desktopAPI", {
	isDesktop: true,
	getWhatsappStatus: () => ipcRenderer.invoke("whatsapp:get-status"),
	connectWhatsapp: (onQr: (qrBase64: string) => void) =>
	{
		ipcRenderer.removeAllListeners("whatsapp:qr");
		ipcRenderer.on("whatsapp:qr", (_event, qr) => onQr(qr));
		return ipcRenderer.invoke("whatsapp:connect");
	},
	disconnectWhatsapp: () => ipcRenderer.invoke("whatsapp:disconnect"),
	sendWhatsappInvoice: (payload: any) => ipcRenderer.invoke("whatsapp:send-invoice", payload)
});