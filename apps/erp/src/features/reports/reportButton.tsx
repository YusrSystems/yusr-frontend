import { Check, Download, Loader2, Printer, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "yusr-ui";
import type { BaseReportRequest } from "@/core/data/report/baseReportRequest.ts";
import ReportApiService from "../../core/networking/reportApiService";


export type ReportButtonProps<T extends BaseReportRequest> = {
	reportName: string;
	request: T;
	fileName?: string;
};

export default function ReportButton<T extends BaseReportRequest>({
	reportName,
	request,
	fileName = "report"
}: ReportButtonProps<T>)
{
	const service = new ReportApiService();

	const [isPrinting, setIsPrinting] = useState(false);
	const [isSharing, setIsSharing] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloaded, setDownloaded] = useState(false);

	const isDisabled = isPrinting || isSharing || isDownloading;

	return (
		<div className="flex ">
			<Button
				className="rounded-e-none! text-primary bg-secondary hover:bg-primary hover:text-secondary transition-colors duration-300"
				disabled={ isDisabled }
				onClick={ async () =>
				{
					setIsDownloading(true);
					const blob = await service.GetBlob(reportName, request);
					if (blob)
					{
						ReportApiService.downloadPdf(blob, fileName);
						setDownloaded(true);
						setTimeout(() => setDownloaded(false), 3000);
					}
					setIsDownloading(false);
				} }
			>
				{ isDownloading
					? <Loader2 className="h-4 w-4 animate-spin"/>
					: downloaded
						? <Check className="h-4 w-4 text-green-500"/>
						: <Download className="h-4 w-4"/> }
			</Button>
			<Button
				className="rounded-none! border-x-0 text-primary bg-secondary hover:bg-primary hover:text-secondary transition-colors duration-300"
				disabled={ isDisabled }
				onClick={ async () =>
				{
					setIsSharing(true);
					await service.Get(reportName, "share", request, fileName);
					setIsSharing(false);
				} }
			>
				{ isSharing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Share2 className="h-4 w-4"/> }
			</Button>
			<Button
				className="rounded-s-none! text-primary bg-secondary hover:bg-primary hover:text-secondary transition-colors duration-300"
				disabled={ isDisabled }
				onClick={ async () =>
				{
					setIsPrinting(true);
					await service.Get(reportName, "display", request, fileName);
					setIsPrinting(false);
				} }
			>
				{ isPrinting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Printer className="h-4 w-4"/> }
			</Button>
		</div>
	);
}
