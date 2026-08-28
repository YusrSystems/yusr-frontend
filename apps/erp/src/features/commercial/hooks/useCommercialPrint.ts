import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { YusrApiHelper } from "yusr-ui";


export function useCommercialPrint<TReportResult>()
{
	const printedReport = useMemo(() => signal<TReportResult | undefined>(undefined), []);
	const isPrinting = useMemo(() => signal<number | undefined>(undefined), []);

	useEffect(() =>
	{
		const handleAfterPrint = () =>
		{
			printedReport.value = undefined;
		};
		window.addEventListener("afterprint", handleAfterPrint);
		return () => window.removeEventListener("afterprint", handleAfterPrint);
	}, [printedReport]);

	const handlePrint = async (
		id: number,
		endpointUrl: string,
		requestPayload: object
	) =>
	{
		isPrinting.value = id;
		try
		{
			const res = await YusrApiHelper.Post<TReportResult>(endpointUrl, requestPayload);
			if (res.data)
			{
				printedReport.value = res.data;
				requestAnimationFrame(() =>
				{
					requestAnimationFrame(() =>
					{
						window.print();
						isPrinting.value = undefined;
					});
				});
			}
			else
			{
				isPrinting.value = undefined;
			}
		}
		catch
		{
			isPrinting.value = undefined;
		}
	};

	return {
		printedReport,
		isPrinting,
		handlePrint
	};
}