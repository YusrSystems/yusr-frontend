import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { FilterLabelWrapper, type FilterValueInputProps, SelectField } from "yusr-ui";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect";
import { PartnerType } from "@/core/data/partner";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import { PaymentStatus } from "@/core/types/paymentStatus";


export function renderCommercialFilterInput(
	props: FilterValueInputProps,
	partnerTypes: PartnerType[] = [PartnerType.Customer]
)
{
	const {rule, field} = props;

	if (field.propertyName === "PartnerId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ (label) => (
					<PartnersSearchableSelect
						id={ rule.value as Signal<number | undefined> }
						label={ label }
						types={ partnerTypes }
						onSelect={ (entity) => (rule.value.value = entity ? entity.id : "") }
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "StoreId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ (label) => (
					<StoresSearchableSelect
						id={ rule.value as Signal<number | undefined> }
						label={ label }
						onSelect={ (entity) => (rule.value.value = entity ? entity.id : "") }
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "ReturnStatusId")
	{
		return <ReturnStatusSelectInput rule={ rule }/>;
	}

	if (field.propertyName === "PaymentStatus")
	{
		return <PaymentStatusSelectInput rule={ rule }/>;
	}

	if (field.propertyName === "Items" || field.propertyName === "InvoiceItems")
	{
		return <ItemsMultiSearchableSelect onToggle={ (ids) => (rule.value.value = ids) }/>;
	}

	return undefined;
}

function ReturnStatusSelectInput({rule}: { rule: FilterValueInputProps["rule"] })
{
	useSignals();
	const {t} = useTranslation("accounting");

	return (
		<SelectField<InvoiceReturnStatus>
			required
			value={ rule.value as Signal<InvoiceReturnStatus | undefined> }
			onValueChange={ (type) => (rule.value.value = type) }
			options={ [
				{label: t("invoices.notReturned"), value: InvoiceReturnStatus.NotReturned},
				{label: t("invoices.partialReturned"), value: InvoiceReturnStatus.PartialReturned},
				{label: t("invoices.fullyReturned"), value: InvoiceReturnStatus.FullyReturned}
			] }
		/>
	);
}

function PaymentStatusSelectInput({rule}: { rule: FilterValueInputProps["rule"] })
{
	useSignals();
	const {t} = useTranslation("accounting");

	return (
		<SelectField<PaymentStatus>
			required
			value={ rule.value as Signal<PaymentStatus | undefined> }
			onValueChange={ (type) => (rule.value.value = type) }
			options={ [
				{label: t("invoices.notPaid"), value: PaymentStatus.NotPaid},
				{
					label: t("invoices.partiallyPaid", {amount: "", currency: ""}),
					value: PaymentStatus.PartiallyPaid
				},
				{label: t("invoices.fullyPaid"), value: PaymentStatus.FullyPaid},
				{label: t("invoices.overpaid"), value: PaymentStatus.Overpaid}
			] }
		/>
	);
}