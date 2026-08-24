import { useTranslation } from "react-i18next";
import { FieldsSection, NumberField, TextAreaField } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { CommercialMath } from "../logic/commercialMath";
import type {
	CommercialDocument,
	ICommercialDocument,
	ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";


export interface CommercialGlobalSettlementProps<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>
{
	document: CommercialDocument<TDto, TItem, TItemDto>;
}

export function CommercialGlobalSettlement<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>({
	document
}: CommercialGlobalSettlementProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {t} = useTranslation("accounting");
	const basePrice = CommercialMath.calcDocumentBaseTaxInclusivePrice(
		(document.items.value || []).map((i) => ({
			taxExclusivePrice: i.taxExclusivePrice.value,
			taxInclusivePrice: i.taxInclusivePrice.value,
			settlement: 0,
			quantity: i.quantity.value,
			totalTaxesPerc: i.totalTaxesPerc.value
		}))
	);

	return (
		<div className="border border-border rounded-xl bg-background overflow-hidden">
			<div className="px-4 py-3 border-b border-border bg-muted/30">
				<h3 className="font-semibold">{ t("invoices.globalSettlement") }</h3>
			</div>
			<div className="p-4 flex flex-col gap-3">
				<FieldsSection columns={ 2 }>
					<NumberField
						label={ t("paymentMethods.fixedAmount") }
						className="mt-1"
						value={ document.settlementAmount }
						min={ -basePrice }
						onChange={ (newValue) =>
						{
							if (newValue === undefined) return;
							document.changeSettlementAmount(newValue);
						} }
						disabled={ document.isDisabled || document.items.value?.length === 0 }
					/>
					<NumberField
						label={ t("paymentMethods.percentage") }
						min={ -100 }
						className="mt-1"
						value={ document.settlementPercent }
						onChange={ (newValue) =>
						{
							if (newValue === undefined) return;
							document.changeSettlementPercent(newValue);
						} }
						disabled={ document.isDisabled || document.items.value?.length === 0 }
					/>
				</FieldsSection>
				<TextAreaField
					label={ t("invoices.settlementReason") }
					value={ document.settlementReason }
					disabled={
						document.isDisabled ||
						document.items.value?.length === 0 ||
						(document.settlementPercent.value === 0 && document.settlementAmount.value === 0)
					}
					collapsible
				/>
			</div>
		</div>
	);
}