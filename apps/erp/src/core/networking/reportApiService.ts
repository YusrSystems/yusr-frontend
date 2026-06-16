import { ApiConstants, YusrApiHelper } from "yusr-ui";
import type { BaseReportRequest } from "../data/report/baseReportRequest";


export default class ReportApiService
{
	async Get(
		reportName: string,
		viewAction: "display" | "share" = "display",
		request: BaseReportRequest,
		filename: string = ""
	): Promise<boolean>
	{
		const url = `${ ApiConstants.baseUrl }/Reports/${ reportName }`;

		const blob = await YusrApiHelper.PostBlob(url, request);

		if (blob == undefined)
		{
			return false;
		}

		if (viewAction === "display")
		{
			ReportApiService.displayPdf(blob);
		}
		if (viewAction === "share")
		{
			await ReportApiService.handleShareFile(blob, filename);
		}

		return true;
	}

	async GetBlob(
		reportName: string,
		request: BaseReportRequest
	): Promise<Blob | undefined>
	{
		const url = `${ ApiConstants.baseUrl }/Reports/${ reportName }`;
		return await YusrApiHelper.PostBlob(url, request);
	}

	public static displayPdf(blob: Blob)
	{
		const url = window.URL.createObjectURL(blob);
		window.open(url, "_blank");
		setTimeout(() => window.URL.revokeObjectURL(url), 100);
	}

	public static downloadPdf(blob: Blob, filename: string)
	{
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${ filename }.pdf`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}

	public static async handleShareFile(blob: Blob, filename: string)
	{
		try
		{
			if (blob == undefined)
			{
				return;
			}

			const file = new File([blob], `${ filename }.pdf`, {type: blob.type});

			if (navigator.canShare && navigator.canShare({files: [file]}))
			{
				await navigator.share({files: [file]});
			}
			else
			{
				ReportApiService.displayPdf(blob);
			}
		}
		catch (error)
		{
			console.error("Error sharing file:", error);
		}
	}
}
