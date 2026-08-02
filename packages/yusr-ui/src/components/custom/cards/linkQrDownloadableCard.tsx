import { QRCodeCanvas } from "qrcode.react";
import { Button } from "#/components/pure";
import { Check, Copy, Download } from "lucide-react";
import { useRef, useState } from "react";


export type LinkQrDownloadableCardProps = {
	title: string;
	url: string;
	copyText: string;
	copiedText: string;
	downloadText: string;
	qrFileNameWhenDownload: string;

}

export function LinkQrDownloadableCard({
	title,
	url,
	copyText,
	copiedText,
	downloadText,
	qrFileNameWhenDownload
}: LinkQrDownloadableCardProps)
{
	const qrRef = useRef<HTMLDivElement>(null);
	const [isCopied, setIsCopied] = useState(false);
	const handleCopyLink = async () =>
	{
		await navigator.clipboard.writeText(url);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	const handleDownloadQR = () =>
	{
		const canvas = qrRef.current?.querySelector("canvas");
		if (!canvas)
		{
			return;
		}

		const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		const downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = `QR-${ qrFileNameWhenDownload || "Company" }.png`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};
	return <div className="w-full flex flex-col items-center gap-3 bg-muted/20 p-3 rounded-lg border">

		<h3 className="text-lg font-bold">{ title }</h3>

		<div ref={ qrRef } className="bg-white p-2 rounded border shadow-sm shrink-0">
			<QRCodeCanvas
				value={ url }
				size={ 150 }
				level="H"
			/>
		</div>

		<Button
			type="button"
			className={ `w-full ${ isCopied ? "bg-green-600 hover:bg-green-700" : "" }` }
			onClick={ handleCopyLink }
		>
			{ isCopied ? <Check className="h-4 w-4 me-2"/> : <Copy className="h-4 w-4 me-2"/> }
			{ isCopied ? copiedText : copyText }
		</Button>

		<Button
			type="button"
			variant="outline"
			onClick={ handleDownloadQR }
			className="w-full"
		>
			<Download className="h-4 w-4 me-2"/>
			{ downloadText }
		</Button>

		<a
			href={ url }
			target="_blank"
			rel="noopener noreferrer"
			className="text-xs text-blue-600 hover:text-primary text-center"
		>
			{ url }
		</a>
	</div>;

}