import { useTranslation } from "react-i18next";
import { TextAreaField } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import type {
	CommercialDocument,
	ICommercialDocument,
	ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";


export interface CommercialPolicyTabProps<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>
{
	document: CommercialDocument<TDto, TItem, TItemDto>;
}

export function CommercialPolicyTab<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>({
	document
}: CommercialPolicyTabProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {t} = useTranslation("accounting");

	return (
		<TextAreaField
			label={ t("invoices.policyTerms") }
			value={ document.policy }
			disabled={ document.isDisabled }
			className="h-100"
		/>
	);
}