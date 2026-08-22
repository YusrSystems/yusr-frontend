import {
	Button,
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	NumberToWordsService,
	SelectField,
	Switch,
	SystemPermissionsActions,
	TextAreaField,
	TextField
} from "yusr-ui";
import { FrequencyType, Voucher, VoucherDto, VoucherType } from "@/core/data/voucher.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { useTranslation } from "react-i18next";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import { CommissionType, PaymentMethod } from "@/core/data/paymentMethod.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { AccountClass, getAccountTypesByClasses } from "@/core/data/account.ts";
import { TransactionStatus } from "#/types/transactionStatus.ts";
import { CalendarClock, CalendarOff, Info } from "lucide-react";
import TerminateVoucherDistributionDialog from "./terminateVoucherDistributionDialog.tsx";
import { canTerminateVoucherDistribution } from "@/features/vouchers/canTerminateVoucherDistribution.tsx";


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
	const selectedPaymentMethod = useMemo(() => signal<PaymentMethod | undefined>(entity.value.paymentMethod.value), [entity.value.paymentMethod.value]);
	const isTerminateDialogOpen = useMemo(() => signal(false), []);

	useEffect(() =>
	{
		Cubits.paymentMethods.init();
		Cubits.partners.init();
	}, []);

	useEffect(() =>
	{
		if (!entity.value.isDirectMode.value) return;
		Cubits.accounts.init(getAccountTypesByClasses(entity.value.type.value === VoucherType.Payment ? [AccountClass.Expense] : [AccountClass.Revenue]));
	}, [entity.value.type.value, entity.value.isDirectMode.value]);

	useEffect(() =>
	{
		if (entity.value.amount.value !== undefined && Services.auth.setting?.currency?.value)
		{
			amountToWords.value = NumberToWordsService.ConvertAmount(
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
		}
		else if (selectedPaymentMethod.value?.commissionType.value === CommissionType.Amount)
		{
			entity.value.commissionAmount.value = selectedPaymentMethod.value.commissionAmount.value ?? 0;
		}
		else
		{
			entity.value.commissionAmount.value = 0;
		}
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

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const isReceipt = entity.value.type.value === VoucherType.Receipt;

	const title = !isUpdateMode
		? t("vouchers.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("vouchers.entityName") }`;

	const isDraft = entity.value.transactionStatus.value === TransactionStatus.Draft;
	const isPosted = entity.value.transactionStatus.value === TransactionStatus.Posted;
	const isVoided = entity.value.transactionStatus.value === TransactionStatus.Voided;

	const count = entity.value.distributionCount.value ?? 1;
	const totalAmount = entity.value.amount.value ?? 0;
	const sliceAmount = count > 0 ? (totalAmount / count).toFixed(2) : "0";

	const canTerminate = !isDraft && !isVoided
		&& canTerminateVoucherDistribution(dto)
		&& Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Update);

	return (
		<>
			<ChangeDialog className="sm:max-w-5xl">
				<ChangeDialog.Header title={ title }/>
				<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
					<FieldGroup className="gap-10">
						<div className="flex bg-muted/40 rounded-lg p-1 border max-w-md mx-auto w-full">
							<Button
								type="button"
								variant={ !entity.value.isDirectMode.value ? "default" : "ghost" }
								onClick={ () =>
								{
									entity.value.isDirectMode.value = false;
									entity.value.glAccountId.value = undefined;
									entity.value.glAccountName.value = undefined;
								} }
								className="flex-1 rounded-md text-xs font-semibold"
								disabled={ !isDraft }
							>
								{ t("vouchers.partnerPaymentMode", "دفعة لحساب عميل / مورد") }
							</Button>
							<Button
								type="button"
								variant={ entity.value.isDirectMode.value ? "default" : "ghost" }
								onClick={ () =>
								{
									entity.value.isDirectMode.value = true;
									entity.value.partnerId.value = undefined;
									entity.value.partnerName.value = undefined;
									entity.value.invoiceId.value = undefined;
								} }
								className="flex-1 rounded-md text-xs font-semibold"
								disabled={ !isDraft }
							>
								{ t("vouchers.directExpenseMode", "مصروف عام / إيراد مباشر") }
							</Button>
						</div>

						<FieldsSection title={ t("vouchers.basicInfo") } columns={ 2 }>
							<SelectField
								label={ t("vouchers.voucherType") }
								required
								value={ entity.value.type }
								error={ entity.value.getError("type") }
								disabled={ !isDraft }
								options={ [
									{label: t("vouchers.receiptVoucher"), value: VoucherType.Receipt},
									{label: t("vouchers.paymentVoucher"), value: VoucherType.Payment}
								] }
								onValueChange={ () => reCalculateCommission() }
							/>
							<DateField
								label={ t("vouchers.date") }
								required
								value={ entity.value.date }
								error={ entity.value.getError("date") }
								disabled={ !isDraft }
							/>
							{ !entity.value.isDirectMode.value && (
								<FormField
									label={ "الجهة" }
									required
									error={ entity.value.getError("partnerId") }
								>
									<PartnersSearchableSelect
										id={ entity.value.partnerId }
										label={ entity.value.partnerName }
										disabled={ !isDraft }
									/>
								</FormField>
							) }
							{ entity.value.isDirectMode.value && (
								<>
									<FormField
										label={ t("vouchers.category", "الحساب") }
										required
										error={ entity.value.getError("glAccountId") }
									>
										<AccountsSearchableSelect
											id={ entity.value.glAccountId }
											label={ entity.value.glAccountName }
											disabled={ !isDraft }
										/>
									</FormField>
									<FormField
										label={ "الجهة (اختياري)" }
									>
										<PartnersSearchableSelect
											id={ entity.value.partnerId }
											label={ entity.value.partnerName }
											disabled={ !isDraft }
										/>
									</FormField>
								</>
							) }
							<FormField
								label={ t("vouchers.paymentMethod") }
								required
								error={ entity.value.getError("paymentMethodId") }
							>
								<PaymentMethodsSearchableSelect
									id={ entity.value.paymentMethodId }
									label={ entity.value.paymentMethod.value?.name }
									onSelect={ (pm) =>
									{
										selectedPaymentMethod.value = new PaymentMethod(pm);
										reCalculateCommission();
									} }
									disabled={ !isDraft }
								/>
							</FormField>
							<NumberField
								label={ t("vouchers.amount") }
								required
								value={ entity.value.amount }
								error={ entity.value.getError("amount") }
								currency={ <ErpCurrencyIcon/> }
								onChange={ () => reCalculateCommission() }
								disabled={ !isDraft }
							/>
							{ isReceipt && (
								<TextField
									label={ t("vouchers.commissionAmount") }
									value={ entity.value.commissionAmount }
									disabled
									className="bg-muted"
								/>
							) }
							<div className="col-span-2">
								<TextField
									disabled
									label={ t("vouchers.amountInWords") }
									value={ amountToWords }
								/>
							</div>
						</FieldsSection>

						<FieldsSection
							title="توزيع المعاملة على فترات دورية"
							columns={ 2 }
						>
							<div
								className="col-span-2 flex items-center justify-between p-3 rounded-lg border bg-muted/20">
								<div className="flex items-center gap-3">
									<CalendarClock className="h-5 w-5 text-primary"/>
									<div>
										<p className="font-semibold text-sm">توزيع القيمة دفتريًا على فترات زمنية</p>
										<p className="text-xs text-muted-foreground">
											{ entity.value.type.value === VoucherType.Payment
												? "توزيع المصروف كأصل مدفوع مقدماً يستهلك دورياً"
												: "توزيع الإيراد كالتزام مؤجل يعترف به دورياً" }
										</p>
									</div>
								</div>
								<Switch
									checked={ entity.value.isDistributed.value }
									onCheckedChange={ (val) =>
									{
										entity.value.isDistributed.value = val;
										if (!val)
										{
											entity.value.distributionFrequency.value = undefined;
											entity.value.distributionCount.value = undefined;
										}
										else
										{
											entity.value.distributionFrequency.value = FrequencyType.Monthly;
											entity.value.distributionCount.value = 12;
										}
									} }
									disabled={ !isDraft }
								/>
							</div>

							{ entity.value.isDistributed.value && (
								<>
									<SelectField
										label="التكرار الدوري"
										value={ entity.value.distributionFrequency }
										disabled={ !isDraft }
										options={ [
											{label: "يومي", value: FrequencyType.Daily},
											{label: "أسبوعي", value: FrequencyType.Weekly},
											{label: "شهري", value: FrequencyType.Monthly},
											{label: "سنوي", value: FrequencyType.Yearly}
										] }
									/>
									<NumberField
										label="عدد الفترات"
										value={ entity.value.distributionCount }
										disabled={ !isDraft }
										placeholder="مثال: 12"
									/>
									<div
										className="col-span-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300">
										<Info className="h-4 w-4 shrink-0 mt-0.5"/>
										<div>
											سيتم دفع كامل المبلغ من البنك/الصندوق في تاريخ السند، ثم يقوم النظام بتوزيع
											حصة
											كل فترة بقيمة <strong>{ sliceAmount } ريال</strong> على
											مدار <strong>{ count } فترة</strong> تلقائياً.
										</div>
									</div>
								</>
							) }

							{ !isDraft && (dto?.distributionCount ?? 0) > 1 && (
								<div className="col-span-2 space-y-3">
									<div
										className="grid grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border text-center">
										<div>
											<p className="text-xs text-muted-foreground">الفترات المعتمدة</p>
											<p className="text-lg font-bold text-primary">{ dto?.recognizedCount } / { dto?.distributionCount }</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">المبلغ المعترف به</p>
											<p className="text-lg font-bold text-green-600 dark:text-green-400">{ (dto?.recognizedAmount ?? 0).toLocaleString() } ريال</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">المتبقي للتوزيع</p>
											<p className="text-lg font-bold text-orange-600 dark:text-orange-400">{ (dto?.remainingUnrecognizedAmount ?? 0).toLocaleString() } ريال</p>
										</div>
									</div>
									{ canTerminate && (
										<div className="flex justify-end">
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-900 dark:hover:bg-orange-950/40 gap-1.5"
												onClick={ () => (isTerminateDialogOpen.value = true) }
											>
												<CalendarOff className="w-4 h-4"/>
												إنهاء التوزيع الدوري
											</Button>
										</div>
									) }
								</div>
							) }
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

						<FieldsSection columns={ 2 }>
							<TextField
								label={ t("vouchers.giver") }
								value={ entity.value.giver }
							/>
							<TextField
								label={ t("vouchers.recipient") }
								value={ entity.value.recipient }
							/>
							<div className="col-span-2">
								<TextAreaField
									label={ t("balanceTransfers.description") }
									value={ entity.value.description }
									collapsible
									collapsedHeight={ 60 }
								/>
							</div>
						</FieldsSection>
					</FieldGroup>
				</div>
				<ChangeDialog.Footer>
					<ChangeDialog.Close/>
					{ isDraft && (
						<>
							<ChangeDialog.SaveButton<Voucher, VoucherDto>
								entity={ entity }
								service={ service }
								variant="outline"
								label={ t("common:saveAsDraft", "حفظ كمسودة") }
								transformData={ (data) =>
								{
									data.transactionStatus = TransactionStatus.Draft;
									if (!entity.value.isDistributed.value)
									{
										data.distributionFrequency = undefined;
										data.distributionCount = undefined;
									}
									return data;
								} }
								onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
								disabled={ isVoided }
							/>
							<ChangeDialog.SaveButton<Voucher, VoucherDto>
								entity={ entity }
								service={ service }
								label={ t("common:saveAndPost", "حفظ واعتماد") }
								transformData={ (data) =>
								{
									data.transactionStatus = TransactionStatus.Posted;
									if (!entity.value.isDistributed.value)
									{
										data.distributionFrequency = undefined;
										data.distributionCount = undefined;
									}
									return data;
								} }
								onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
								checkEntityChanges={ false }
								disabled={ isVoided }
							/>
						</>
					) }
					{ (isPosted || isVoided) && (
						<ChangeDialog.SaveButton<Voucher, VoucherDto>
							entity={ entity }
							service={ service }
							label={ t("common:saveButton.saveChanges") }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
						/>
					) }
				</ChangeDialog.Footer>
			</ChangeDialog>

			{ isTerminateDialogOpen.value && dto && (
				<TerminateVoucherDistributionDialog
					open={ isTerminateDialogOpen.value }
					onOpenChange={ (open) => (isTerminateDialogOpen.value = open) }
					voucher={ dto }
					onSuccess={ (updated) =>
					{
						entity.value.rowVer.value = updated.rowVer;
						entity.value.remainingUnrecognizedAmount.value = updated.remainingUnrecognizedAmount ?? 0;
						entity.value.recognizedCount.value = updated.recognizedCount ?? 0;
						entity.value.recognizedAmount.value = updated.recognizedAmount ?? 0;
						dto.rowVer = updated.rowVer;
						dto.remainingUnrecognizedAmount = updated.remainingUnrecognizedAmount;
						dto.recognizedCount = updated.recognizedCount;
						dto.recognizedAmount = updated.recognizedAmount;
						onSuccess?.(updated, entity.value.mode.value);
					} }
				/>
			) }
		</>
	);
}