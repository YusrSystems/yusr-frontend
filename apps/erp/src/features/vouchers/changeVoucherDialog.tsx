import {
	ChangeDialog,
	CheckboxField,
	type CommonChangeDialogProps,
	CurrencyIcon,
	DateField,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	NumbertoWordsService,
	SelectField,
	SystemPermissionsActions,
	TextAreaField,
	TextField
} from "yusr-ui";
import { type Voucher, VoucherDto, VoucherType } from "@/core/data/voucher.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { useTranslation } from "react-i18next";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import { CommissionType, type PaymentMethod } from "@/core/data/paymentMethod.ts";


export default function ChangeVoucherDialog({
	entity,
	service,
	onSuccess
}: CommonChangeDialogProps<Voucher, VoucherDto>)
{
	useSignals();

	const {t} = useTranslation(["accounting", "common"]);
	const amountToWords = useMemo(() => signal<string>(""), []);
	const selectedPaymentMethod = useMemo(() => signal<PaymentMethod | undefined>(undefined), []);

	useEffect(() =>
	{
		Cubits.accounts.init([AccountType.Client, AccountType.Supplier]);
	}, []);

	useEffect(() =>
	{
		if (entity.amount.value !== undefined && Services.auth.setting?.currency?.value)
		{
			amountToWords.value = NumbertoWordsService.ConvertAmount(
				entity.amount.value,
				Services.auth.setting.currency.value
			);
		}
	}, [entity.amount.value, amountToWords]);

	const reCalculateCommission = (): number =>
	{
		if (entity.type.value == undefined || entity.amount.value == undefined || selectedPaymentMethod.value == undefined || entity.type.value === VoucherType.Payment)
		{
			return 0;
		}

		if (selectedPaymentMethod.value.commissionType.value === CommissionType.Percent)
		{
			return (entity.amount.value * (selectedPaymentMethod.value.commissionAmount.value ?? 0)) / 100;
		}
		else if (selectedPaymentMethod.value.commissionType.value === CommissionType.Amount)
		{
			return selectedPaymentMethod.value.commissionAmount.value ?? 0;
		}

		return 0;
	};

	if (
		(entity.mode.value === "create"
			&& !Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Add))
		|| (entity.mode.value === "update"
			&& !Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isPayment = entity.type.value === VoucherType.Payment;
	const isReceipt = entity.type.value === VoucherType.Receipt;
	const title = entity.mode.value === "create"
		? t("vouchers.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("vouchers.entityName") }`;

	return <ChangeDialog className="sm:max-w-lg">
		<ChangeDialog.Header title={ title }/>
		<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
			<FieldGroup className="gap-10">
				<FieldsSection title={ t("vouchers.basicInfo") } columns={ 2 }>
					<SelectField
						label={ t("vouchers.voucherType") }
						required
						value={ entity.type }
						error={ entity.getError("type") }
						options={
							[
								{
									label: t("vouchers.receiptVoucher"),
									value: VoucherType.Receipt
								},
								{
									label: t("vouchers.paymentVoucher"),
									value: VoucherType.Payment
								}
							] }
						onValueChange={ (newType) =>
						{
							if (newType === VoucherType.Receipt)
							{
								entity.isAmountDue.value = false;
							}
							reCalculateCommission();
						} }
					/>

					<DateField
						label={ t("vouchers.date") }
						required
						value={ entity.date ? signal(new Date(entity.date.value)) : undefined }
						error={ entity.getError("date") }
					/>
				</FieldsSection>

				<FieldsSection columns={ 2 }>
					<FormField
						label={ t("vouchers.account") }
						required
						error={ entity.getError("accountId") }
					>


						<AccountsSearchableSelect
							disabled={ entity.mode.value === "update" }
							types={ [AccountType.Client, AccountType.Supplier] }
							id={ entity.accountId }
							label={ entity.accountName }
							showAddButton={ false }
						/>


					</FormField>

					<FormField
						label={ t("vouchers.paymentMethod") }
						required
						error={ entity.getError("paymentMethodId") }
					>
						<PaymentMethodsSearchableSelect
							id={ entity.paymentMethodId }
							label={ entity.paymentMethod.value?.name }
							onSelect={ (pm) =>
							{
								selectedPaymentMethod.value = pm;
								reCalculateCommission();
							} }
						/>
					</FormField>
				</FieldsSection>

				<FieldsSection columns={ 3 }>
					<NumberField
						label={ t("vouchers.amount") }
						required
						value={ entity.amount }
						error={ entity.getError("amount") }
						currency={ <CurrencyIcon/> }
						onChange={ () => reCalculateCommission() }
					/>

					{ isReceipt && (
						<NumberField
							label={ t("vouchers.commissionAmount") }
							value={ entity.commissionAmount }
							disabled={ true }
							className="bg-muted"
						/>
					) }

					{ isPayment && (
						<CheckboxField
							required
							id="isAmountDue"
							label={ t("vouchers.amountDue") }
							error={ entity.getError("isAmountDue") }
							checked={ entity.isAmountDue ?? false }
						/>
					) }

					<TextField
						disabled
						label={ t("vouchers.amountInWords") }
						value={ amountToWords }
						onChange={ () => undefined }
					/>
				</FieldsSection>

				<FieldsSection title={ t("vouchers.partyInfo") } columns={ 2 }>
					<TextField
						label={ t("vouchers.giver") }
						value={ entity.giver }
					/>
					<TextField
						label={ t("vouchers.recipient") }
						value={ entity.recipient }
					/>
				</FieldsSection>

				{ entity.invoiceId.value && (
					<FieldsSection title={ t("vouchers.systemLinks") } columns={ 1 }>
						<TextField
							label={ t("vouchers.relatedInvoice") }
							value={ signal(`#${ entity.invoiceId.value }`) }
							disabled={ true }
							className="bg-muted w-1/2"
						/>
					</FieldsSection>
				) }

				<FieldsSection columns={ 1 }>
					<TextAreaField
						label={ t("vouchers.description") }
						value={ entity.description || "" }
						rows={ 15 }
					/>
				</FieldsSection>
			</FieldGroup>
		</div>

		<ChangeDialog.Footer>
			<ChangeDialog.Close/>
			<ChangeDialog.SaveButton<Voucher, VoucherDto>
				entity={ entity }
				service={ service }
				onSuccess={ (data) => onSuccess?.(data) }
			/>
		</ChangeDialog.Footer>
	</ChangeDialog>;
}