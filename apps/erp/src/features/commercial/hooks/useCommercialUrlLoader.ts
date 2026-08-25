import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { type Signal } from "@preact/signals-react";
import { ChangeableEntityMode, type RequestResult } from "yusr-ui";
import type { ICommercialDocumentDto } from "@/core/data/commercial/commercialDocument";
import type { QuotationDto } from "@/core/data/commercial/quotation";


export interface UseCommercialUrlLoaderOptions<
	TDto extends ICommercialDocumentDto,
	TQuotationDto extends ICommercialDocumentDto = QuotationDto
>
{
	mode: Signal<ChangeableEntityMode>;
	isLoading: Signal<boolean>;
	hasAddAuth: boolean;
	fetchReturnDetails?: (id: number) => Promise<RequestResult<TDto>>;
	fetchCopyDetails?: (id: number) => Promise<RequestResult<TDto>>;
	fetchQuotationDetails?: (id: number) => Promise<RequestResult<TQuotationDto>>;
	onLoadReturn?: (dto: TDto) => void;
	onLoadCopy?: (dto: TDto) => void;
	onLoadQuotation?: (dto: TQuotationDto) => void;
}

export function useCommercialUrlLoader<
	TDto extends ICommercialDocumentDto,
	TQuotationDto extends ICommercialDocumentDto = QuotationDto
>({
	mode,
	isLoading,
	hasAddAuth,
	fetchReturnDetails,
	fetchCopyDetails,
	fetchQuotationDetails,
	onLoadReturn,
	onLoadCopy,
	onLoadQuotation
}: UseCommercialUrlLoaderOptions<TDto, TQuotationDto>)
{
	const [searchParams] = useSearchParams();
	const returnFromId = searchParams.get("returnFromId");
	const copyFromId = searchParams.get("copyFromId");
	const fromQuotationId = searchParams.get("fromQuotationId");

	useEffect(() =>
	{
		if (!hasAddAuth || mode.value !== ChangeableEntityMode.Create) return;

		if (returnFromId && Number(returnFromId) > 0 && fetchReturnDetails && onLoadReturn)
		{
			isLoading.value = true;
			fetchReturnDetails(Number(returnFromId))
				.then((res) =>
				{
					if (res?.data) onLoadReturn(res.data);
				})
				.finally(() =>
				{
					isLoading.value = false;
				});
		}
	}, [returnFromId, hasAddAuth, mode.value]);

	useEffect(() =>
	{
		if (!hasAddAuth || mode.value !== ChangeableEntityMode.Create) return;

		if (copyFromId && Number(copyFromId) > 0 && fetchCopyDetails && onLoadCopy)
		{
			isLoading.value = true;
			fetchCopyDetails(Number(copyFromId))
				.then((res) =>
				{
					if (res?.data) onLoadCopy(res.data);
				})
				.finally(() =>
				{
					isLoading.value = false;
				});
		}
	}, [copyFromId, hasAddAuth, mode.value]);

	useEffect(() =>
	{
		if (!hasAddAuth || mode.value !== ChangeableEntityMode.Create) return;

		if (fromQuotationId && Number(fromQuotationId) > 0 && fetchQuotationDetails && onLoadQuotation)
		{
			isLoading.value = true;
			fetchQuotationDetails(Number(fromQuotationId))
				.then((res) =>
				{
					if (res?.data) onLoadQuotation(res.data);
				})
				.finally(() =>
				{
					isLoading.value = false;
				});
		}
	}, [fromQuotationId, hasAddAuth, mode.value]);

	return {
		returnFromId,
		copyFromId,
		fromQuotationId
	};
}