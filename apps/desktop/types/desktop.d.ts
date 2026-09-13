export interface DesktopAPI
{
	isDesktop: boolean;
	getWhatsappStatus: () => Promise<{ isConnected: boolean; phoneNumber?: string }>;
	connectWhatsapp: (onQr: (qrBase64: string) => void) => Promise<{ qrCodeBase64?: string; isConnected?: boolean }>;
	disconnectWhatsapp: () => Promise<{ success: boolean }>;
	sendWhatsappInvoice: (payload: {
		phoneNumber: string;
		message: string;
		htmlContent: string;
		fileName?: string;
	}) => Promise<{ success: boolean }>;
}

declare global
{
	interface Window
	{
		desktopAPI?: DesktopAPI;
	}
}