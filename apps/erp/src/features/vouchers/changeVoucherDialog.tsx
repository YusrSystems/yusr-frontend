import {
	ChangeableEntityMode,
	ChangeDialog,
	CheckboxField,
	type CommonChangeDialogProps,
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
import { Voucher, VoucherDto, VoucherType } from "@/core/data/voucher.ts";
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
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function ChangeVoucherDialog({
	dto,
	service,
	onSuccess
}: CommonChangeDialogProps<VoucherDto>)
{
	useSignals();
	const entity = useMemo(() => signal<Voucher>(dto ? Voucher.load(dto) : Voucher.create()), []);

	const {t} = useTranslation(["accounting", "common"]);
	const amountToWords = useMemo(() => signal<string>(""), []);
	const selectedPaymentMethod = useMemo(() =>
		signal<PaymentMethod | undefined>(entity.value.paymentMethod.value), [entity.value.paymentMethod.value]);

	useEffect(() =>
	{
		Cubits.accounts.init([AccountType.Client, AccountType.Supplier]);
		Cubits.paymentMethods.init();
	}, []);

	useEffect(() =>
	{
		if (entity.value.amount.value !== undefined && Services.auth.setting?.currency?.value)
		{
			amountToWords.value = NumbertoWordsService.ConvertAmount(
				entity.value.amount.value,
				Services.auth.setting.currency.value
			);
		}
	}, [entity.value.amount.value, amountToWords]);

	const reCalculateCommission = () =>
	{
		if (entity.value.type.value == undefined ||
			entity.value.amount.value == undefined ||
			selectedPaymentMethod.value == undefined ||
			entity.value.type.value === VoucherType.Payment)
		{
			entity.value.commissionAmount.value = 0;
			return;
		}

		if (selectedPaymentMethod.value?.commissionType.value === CommissionType.Percent)
		{
			entity.value.commissionAmount.value = (entity.value.amount.value * (selectedPaymentMethod.value.commissionAmount.value ?? 0)) / 100;
			return;
		}
		else if (selectedPaymentMethod.value?.commissionType.value === CommissionType.Amount)
		{
			entity.value.commissionAmount.value = selectedPaymentMethod.value.commissionAmount.value ?? 0;
			return;
		}

		entity.value.commissionAmount.value = 0;
	};

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isPayment = entity.value.type.value === VoucherType.Payment;
	const isReceipt = entity.value.type.value === VoucherType.Receipt;
	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("vouchers.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("vouchers.entityName") }`;

	return <ChangeDialog className="sm:max-w-4xl">
		<ChangeDialog.Header title={ title }/>
		<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
			<FieldGroup className="gap-10">
				<FieldsSection title={ t("vouchers.basicInfo") } columns={ 2 }>
					<SelectField
						label={ t("vouchers.voucherType") }
						required
						value={ entity.value.type }
						error={ entity.value.getError("type") }
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
								entity.value.isAmountDue.value = false;
							}
							reCalculateCommission();
						} }
					/>

					<DateField
						label={ t("vouchers.date") }
						required
						value={ entity.value.date }
						error={ entity.value.getError("date") }
					/>
				</FieldsSection>

				<FieldsSection columns={ 2 }>
					<FormField
						label={ t("vouchers.account") }
						required
						error={ entity.value.getError("accountId") }
					>


						<AccountsSearchableSelect
							disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
							types={ [AccountType.Client, AccountType.Supplier] }
							id={ entity.value.accountId }
							label={ entity.value.accountName }
							showAddButton={ false }
						/>


					</FormField>

					<FormField
						label={ t("vouchers.paymentMethod") }
						required
						error={ entity.value.getError("paymentMethodId") }
					>
						<PaymentMethodsSearchableSelect
							id={ entity.value.paymentMethodId }
							label={ entity.value.paymentMethod.value?.name }
							onSelect={ (pm: PaymentMethod) =>
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
						value={ entity.value.amount }
						error={ entity.value.getError("amount") }
						currency={ <ErpCurrencyIcon/> }
						onChange={ () => reCalculateCommission() }
					/>

					{ isReceipt && (
						<TextField
							label={ t("vouchers.commissionAmount") }
							value={ entity.value.commissionAmount }
							disabled
							className="bg-muted"
						/>
					) }

					{ isPayment && (
						<CheckboxField
							required
							id="isAmountDue"
							label={ t("vouchers.amountDue") }
							error={ entity.value.getError("isAmountDue") }
							checked={ entity.value.isAmountDue ?? false }
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
						value={ entity.value.giver }
					/>
					<TextField
						label={ t("vouchers.recipient") }
						value={ entity.value.recipient }
					/>
				</FieldsSection>

				{ entity.value.invoiceId.value && (
					<FieldsSection title={ t("vouchers.systemLinks") } columns={ 1 }>
						<TextField
							label={ t("vouchers.relatedInvoice") }
							value={ signal(`#${ entity.value.invoiceId.value }`) }
							disabled={ true }
							className="bg-muted w-1/2"
						/>
					</FieldsSection>
				) }

				<FieldsSection columns={ 1 }>
					<TextAreaField
						label={ t("vouchers.description") }
						value={ entity.value.description || "" }
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
				onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
			/>
		</ChangeDialog.Footer>
	</ChangeDialog>;
}