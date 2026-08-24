import { BanknoteArrowUp, Box, FolderKanban, Plus, Siren, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
	Button,
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	FieldsSection,
	FormField,
	Loading,
	NumberField,
	type RequestResult,
	SelectField,
	StorageType,
	SystemPermissionsActions,
	TextField,
	useStorageFile
} from "yusr-ui";
import { signal, useComputed } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { SalesInvoice, SalesInvoiceDto, SalesInvoiceMode } from "@/core/data/commercial/salesInvoice";
import { getSalesInvoiceTypeName, SalesInvoiceType } from "@/core/types/commercialEnums";
import { ItemType } from "@/core/data/item";
import { PartnerDto, PartnerType } from "@/core/data/partner";
import { ImportExportType } from "@/core/types/importExportType";
import { Voucher, VoucherType } from "@/core/data/voucher";
import { AccountClass, getAccountTypesByClasses } from "@/core/data/account";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import StoreItemSelector from "@/features/items/storeItemSelector";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { CommercialItemsTable } from "@/features/commercial/components/commercialItemsTable";
import { CommercialGlobalSettlement } from "@/features/commercial/components/commercialGlobalSettlement";
import { CommercialSummaryCard } from "@/features/commercial/components/commercialSummaryCard";
import { CommercialPolicyTab } from "@/features/commercial/components/commercialPolicyTab";
import { CommercialAttachmentsTab } from "@/features/commercial/components/commercialAttachmentsTab";
import { CommercialPaymentVouchers } from "@/features/commercial/components/commercialPaymentVouchers";
import { CommercialMath } from "@/features/commercial/logic/commercialMath";
import { ItemProfitDialog } from "./profit/itemProfitDialog.tsx";
import InvoiceProfitDialog from "./profit/invoiceProfitDialog.tsx";


export default function ChangeSalesInvoiceDialog({
	dto,
	service,
	onSuccess,
	fixedType = SalesInvoiceType.Invoice
}: CommonChangeDialogProps<SalesInvoiceDto> & {
	fixedType?: SalesInvoiceType;
})
{
	useSignals();
	const {t} = useTranslation("accounting");
	const [searchParams] = useSearchParams();
	const fromQuotationId = searchParams.get("fromQuotationId");

	const entity = useMemo(() => signal(dto ? SalesInvoice.load(dto) : SalesInvoice.create({type: fixedType})), [dto, fixedType]);
	const isLoading = useMemo(() => signal(false), []);
	const isSaving = useMemo(() => signal(false), []);
	const hasCostVouchers = useMemo(() => signal(false), []);
	const selectedPartner = useMemo(() => signal<PartnerDto | undefined>(undefined), []);

	const {commitFiles} = useStorageFile(
		() => entity.value.files.value ?? [],
		(files) => (entity.value.files.value = files),
		StorageType.Private
	);

	useEffect(() =>
	{
		Cubits.paymentMethods.init();
		Cubits.stores.init();
		Cubits.partners.init([PartnerType.Customer]);
		Cubits.accounts.init(getAccountTypesByClasses([AccountClass.Expense]));
		Cubits.items.init();
	}, []);

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Create && fromQuotationId && Number(fromQuotationId) > 0)
		{
			isLoading.value = true;
			const loadQuote = async () =>
			{
				try
				{
					const res = await Services.quotationsApi.Get(Number(fromQuotationId));
					if (res?.data)
					{
						entity.value.loadFromQuotation(res.data);
					}
				}
				finally
				{
					isLoading.value = false;
				}
			};
			void loadQuote();
		}
	}, [fromQuotationId]);

	const currentStoreId = entity.value.storeId.value;
	useEffect(() =>
	{
		if (currentStoreId && !entity.value.isDisabled)
		{
			Cubits.items.init([ItemType.Product, ItemType.Service], {storeId: currentStoreId});
		}
	}, [currentStoreId]);

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Create) return;
		if (entity.value.id.value)
		{
			isLoading.value = true;
			const load = async () =>
			{
				let res: RequestResult<SalesInvoiceDto>;
				if (entity.value.invoiceMode.value !== SalesInvoiceMode.Return)
				{
					res = await Services.salesInvoicesApi.Get(entity.value.id.value);
				}
				else
				{
					res = await Services.salesInvoicesApi.GetReturnInvoiceInitialDetails(entity.value.id.value);
				}
				if (res?.data)
				{
					if (entity.value.invoiceMode.value === SalesInvoiceMode.Normal)
					{
						entity.value = SalesInvoice.load(res.data);
					}
					else if (entity.value.invoiceMode.value === SalesInvoiceMode.Return)
					{
						res.data.originalSalesInvoiceId = entity.value.id.value;
						res.data.type = SalesInvoiceType.CreditNote;
						hasCostVouchers.value = res.data.costVouchers.length > 0;
						res.data.costVouchers = [];
						res.data.paymentVouchers = res.data.paymentVouchers.map((v) => ({...v, id: 0}));
						entity.value = SalesInvoice.create(res.data);
						entity.value.invoiceMode.value = SalesInvoiceMode.Return;
						entity.value.syncPaymentVouchers();
					}
					else if (entity.value.invoiceMode.value === SalesInvoiceMode.Copy)
					{
						res.data.id = 0;
						res.data.idempotencyKey = crypto.randomUUID();
						entity.value = SalesInvoice.create(res.data);
						entity.value.invoiceMode.value = SalesInvoiceMode.Copy;
						entity.value.syncPaymentVouchers();
					}
				}
				isLoading.value = false;
			};
			void load();
		}
	}, [entity.value.id.value, entity.value.mode.value]);

	const invoiceOrigin = useComputed(() =>
	{
		const partnerCountryId = selectedPartner.value?.city?.countryId;
		const settingsCountryId = Services.auth.setting?.branch?.value?.city.value?.countryId.value;
		if (partnerCountryId === undefined || settingsCountryId === undefined)
		{
			return {canBeExportInvoice: false};
		}
		return {canBeExportInvoice: partnerCountryId !== settingsCountryId};
	});

	const transformDataBeforeSave = async (data: SalesInvoiceDto): Promise<SalesInvoiceDto> =>
	{
		data.fullAmount = CommercialMath.calcDocumentTaxInclusivePrice(
			entity.value.items.value.map((i) => ({
				taxExclusivePrice: i.taxExclusivePrice.value,
				taxInclusivePrice: i.taxInclusivePrice.value,
				settlement: i.settlement.value,
				quantity: i.quantity.value,
				totalTaxesPerc: i.totalTaxesPerc.value
			}))
		);
		data.items.forEach((ii, index) => (ii.index = index));
		data.files = await commitFiles(entity.value.files.value, "SalesInvoices");
		return data;
	};

	const getDialogTitle = () =>
	{
		if (entity.value.basedOnQuotationId.value)
		{
			return `تحويل عرض السعر #${ entity.value.basedOnQuotationId.value } إلى فاتورة مبيعات`;
		}
		if (entity.value.invoiceMode.value === SalesInvoiceMode.Return)
		{
			return "إضافة إشعار دائن (مرتجع مبيعات)";
		}
		if (entity.value.mode.value === ChangeableEntityMode.Create)
		{
			return `إضافة ${ getSalesInvoiceTypeName(entity.value.type.value, t) }`;
		}
		return `تعديل ${ getSalesInvoiceTypeName(entity.value.type.value, t) }`;
	};

	if (isLoading.value)
	{
		return (
			<ChangeDialog>
				<ChangeDialog.Header title={ getDialogTitle() }/>
				<Loading entityName={ t("invoices.entityName") }/>
			</ChangeDialog>
		);
	}

	const basicHasError =
		entity.value.hasErrors ||
		entity.value.items.value.some((t) => t.hasErrors) ||
		entity.value.paymentVouchers.value.some((t) => t.hasErrors);
	const costHasError = entity.value.costVouchers.value.some((t) => t.hasErrors);

	const saveButtonLabel = entity.value.basedOnQuotationId.value
		? "إنشاء واعتماد الفاتورة"
		: undefined;

	return (
		<ChangeDialog className="sm:max-w-[100vw] sm:w-screen sm:h-screen">
			<ChangeDialog.Header title={ getDialogTitle() }/>
			<ChangeDialog.Tabbed
				tabs={ [
					{
						label: t("invoices.basicInfo"),
						icon: Box,
						active: true,
						hasError: basicHasError,
						content: (
							<div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
								<div className="xl:col-span-8 2xl:col-span-9 space-y-4 min-w-0">
									<FieldsSection columns={ {base: 1, md: 2, lg: 4} }>
										<DateField
											label={ t("invoices.invoiceDate") }
											required
											value={ entity.value.date }
											error={ entity.value.getError("date") }
										/>
										<FormField
											label={ t("invoices.store") }
											required
											error={ entity.value.getError("storeId") }
										>
											<StoresSearchableSelect
												id={ entity.value.storeId }
												label={ entity.value.storeName }
												disabled={ entity.value.isDisabled }
												onSelect={ () =>
												{
													entity.value.items.value = [];
													entity.value.paymentVouchers.value = [];
												} }
											/>
										</FormField>
										<FormField
											label={ t("vouchers.customer", "العميل") }
											required
											error={ entity.value.getError("partnerId") }
										>
											<PartnersSearchableSelect
												id={ entity.value.partnerId }
												label={ entity.value.partnerName }
												disabled={ entity.value.isDisabled }
												types={ [PartnerType.Customer] }
												onSelect={ (partner) =>
												{
													selectedPartner.value = partner;
													entity.value.paymentVouchers.value.forEach((voucher) =>
													{
														voucher.partnerId.value = partner?.id;
														voucher.partnerName.value = partner?.name;
													});
												} }
											/>
										</FormField>
										<TextField
											label={ t("invoices.relatedInvoiceNumber") }
											disabled
											value={ entity.value.originalSalesInvoiceId }
										/>
										<TextField label="مندوب المبيعات" value={ entity.value.delegateEmp }/>
										{ invoiceOrigin.value.canBeExportInvoice && (
											<SelectField<ImportExportType>
												label={ t("invoices.importInvoice") }
												required
												value={ entity.value.importExportType }
												error={ entity.value.getError("importExportType") }
												options={ [
													{label: "محلي (Local)", value: ImportExportType.Local},
													{label: "تصدير (Export)", value: ImportExportType.Export}
												] }
											/>
										) }
										<div className="col-span-1 md:col-span-2 lg:col-span-4">
											<TextField label={ t("invoices.notes") } value={ entity.value.notes }/>
										</div>
									</FieldsSection>

									{ !entity.value.isDisabled && entity.value.invoiceMode.value !== SalesInvoiceMode.Return && (
										<StoreItemSelector
											storeId={ entity.value.storeId }
											onSelect={ (item, uomId, pmId) =>
											{
												entity.value.addItem(item, uomId, pmId);
											} }
										/>
									) }

									<CommercialItemsTable
										document={ entity.value }
										type="sales"
										allowReturnQuantityConstraint={ entity.value.invoiceMode.value === SalesInvoiceMode.Return }
										renderExtraAction={ (item) =>
											Services.auth.hasAuth(
												SystemPermissionsResources.InvoiceShowItemProfit,
												SystemPermissionsActions.Get
											) ? (
												<ItemProfitDialog invoiceItem={ item }/>
											) : null
										}
									/>
								</div>

								<div className="xl:col-span-4 2xl:col-span-3">
									<div className="sticky top-4 space-y-4">
										{ Services.auth.hasAuth(
											SystemPermissionsResources.InvoiceAddSettlement,
											SystemPermissionsActions.Get
										) && <CommercialGlobalSettlement document={ entity.value }/> }

										<CommercialSummaryCard
											document={ entity.value }
											renderFooter={
												Services.auth.hasAuth(
													SystemPermissionsResources.InvoiceShowProfit,
													SystemPermissionsActions.Get
												) ? (
													<InvoiceProfitDialog invoice={ entity.value }/>
												) : null
											}
										/>

										<CommercialPaymentVouchers document={ entity.value }/>
									</div>
								</div>
							</div>
						)
					},
					{
						label: t("invoices.invoiceCosts"),
						icon: BanknoteArrowUp,
						active: false,
						hasError: costHasError,
						content: (
							<div className="flex flex-col gap-2 items-end">
								<Button
									type="button"
									className="max-w-45"
									size="lg"
									onClick={ () =>
									{
										const newVoucher = Voucher.create({
											salesInvoiceId: entity.value.id.value,
											paymentMethodId: Services.auth.setting?.mainPaymentMethodId?.value,
											type: VoucherType.Payment,
											amount: 0,
											isDirectMode: true
										});
										entity.value.costVouchers.value = [...entity.value.costVouchers.value, newVoucher];
									} }
								>
									<Plus className="w-4 h-4 me-2"/> { t("invoices.addCostVoucher") }
								</Button>
								<div
									className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
									<table className="w-full text-sm text-right">
										<thead className="bg-muted/40 border-b border-border">
										<tr>
											<th className="p-3 font-semibold w-16 text-center text-muted-foreground">#</th>
											<th className="p-3 text-start font-semibold">{ t("invoices.account", "الحساب") }</th>
											<th className="p-3 text-start font-semibold">{ t("invoices.partner", "الجهة (اختياري)") }</th>
											<th className="p-3 text-start font-semibold">{ t("invoices.paymentMethod") }</th>
											<th className="p-3 text-start font-semibold">{ t("invoices.amount") }</th>
											<th className="p-3 text-start font-semibold">{ t("invoices.description") }</th>
											<th className="p-4 text-start font-semibold w-16"/>
										</tr>
										</thead>
										<tbody>
										{ entity.value.costVouchers.value.map((voucher, index) => (
											<tr key={ index }
											    className="border-b border-border last:border-0 hover:bg-muted/20">
												<td className="p-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>
												<td className="p-2 min-w-30">
													<FormField label="" error={ voucher.getError("glAccountId") }>
														<AccountsSearchableSelect
															id={ voucher.glAccountId }
															label={ voucher.glAccountName }
														/>
													</FormField>
												</td>
												<td className="p-2 min-w-30">
													<FormField label="" error={ voucher.getError("partnerId") }>
														<PartnersSearchableSelect
															label={ voucher.partnerName }
															id={ voucher.partnerId }
														/>
													</FormField>
												</td>
												<td className="p-2 min-w-30">
													<FormField label="" error={ voucher.getError("paymentMethodId") }>
														<PaymentMethodsSearchableSelect
															id={ voucher.paymentMethodId }
															label={ voucher.paymentMethodName }
														/>
													</FormField>
												</td>
												<td className="p-2 w-40">
													<NumberField
														label=""
														value={ voucher.amount }
														error={ voucher.getError("amount") }
														currency={ <ErpCurrencyIcon/> }
													/>
												</td>
												<td className="p-2">
													<TextField
														label=""
														value={ voucher.description }
														error={ voucher.getError("description") }
													/>
												</td>
												<td className="p-4 text-center align-top pt-5">
													<button
														type="button"
														onClick={ () =>
														{
															entity.value.costVouchers.value = entity.value.costVouchers.value.filter(
																(v) => v !== voucher
															);
														} }
														className="p-2 text-red-500 hover:text-red-700 rounded-md"
													>
														<Trash2 className="h-5 w-5"/>
													</button>
												</td>
											</tr>
										)) }
										</tbody>
									</table>
								</div>
							</div>
						)
					},
					{
						label: t("invoices.invoicePolicy"),
						icon: Siren,
						active: false,
						content: <CommercialPolicyTab document={ entity.value }/>
					},
					{
						label: t("invoices.invoiceAttachments"),
						icon: FolderKanban,
						active: false,
						content: <CommercialAttachmentsTab document={ entity.value }/>
					}
				] }
			/>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<SalesInvoice, SalesInvoiceDto>
					entity={ entity }
					service={ service }
					label={ saveButtonLabel }
					loadingSignal={ isSaving }
					showConfirmationDialog={ () => hasCostVouchers.value }
					confirmationDialog={
						<DialogContent dir="rtl" className="sm:max-w-xl">
							<DialogHeader>
								<DialogTitle>الفاتورة الأصلية تحتوي على سندات تكاليف</DialogTitle>
								<DialogDescription>
									تم العثور على سندات تكاليف مرتبطة بالفاتورة الأصلية. يرجى تحديد كيفية التعامل معها.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">إلغاء</Button>
								</DialogClose>
								<Button
									variant="outline"
									onClick={ async () =>
									{
										entity.value.deleteOriginalInvoiceCostVouchers.value = false;
										await service.Add(await transformDataBeforeSave(entity.value.toJson()));
									} }
								>
									إبقاء التكاليف
								</Button>
								<Button
									variant="destructive"
									onClick={ async () =>
									{
										entity.value.deleteOriginalInvoiceCostVouchers.value = true;
										await service.Add(await transformDataBeforeSave(entity.value.toJson()));
									} }
								>
									حذف التكاليف
								</Button>
							</DialogFooter>
						</DialogContent>
					}
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
					transformData={ transformDataBeforeSave }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}