import { Box, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldsSection,
	FormField,
	Loading,
	type RequestResult,
	SelectField,
	StorageType,
	SystemPermissionsActions,
	TextField,
	useStorageFile
} from "yusr-ui";
import { signal, useComputed } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { PurchaseInvoice, PurchaseInvoiceDto, PurchaseInvoiceMode } from "@/core/data/commercial/purchaseInvoice";
import { getPurchaseInvoiceTypeName, PurchaseInvoiceType } from "@/core/types/commercialEnums";
import { PartnerDto, PartnerType } from "@/core/data/partner";
import { ImportExportType } from "@/core/types/importExportType";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import StoreItemSelector from "@/features/items/storeItemSelector";
import { CommercialItemsTable } from "../components/commercialItemsTable";
import { CommercialGlobalSettlement } from "../components/commercialGlobalSettlement";
import { CommercialSummaryCard } from "../components/commercialSummaryCard";
import { CommercialPolicyTab } from "../components/commercialPolicyTab";
import { CommercialAttachmentsTab } from "../components/commercialAttachmentsTab";
import { CommercialPaymentVouchers } from "../components/commercialPaymentVouchers";
import { CommercialMath } from "../logic/commercialMath";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";


export default function ChangePurchaseInvoiceDialog({
	dto,
	service,
	onSuccess,
	fixedType = PurchaseInvoiceType.Bill
}: CommonChangeDialogProps<PurchaseInvoiceDto> & {
	fixedType?: PurchaseInvoiceType;
})
{
	useSignals();
	const {t} = useTranslation("accounting");
	const entity = useMemo(() => signal(dto ? PurchaseInvoice.load(dto) : PurchaseInvoice.create({type: fixedType})), [dto, fixedType]);
	const isLoading = useMemo(() => signal(false), []);
	const isSaving = useMemo(() => signal(false), []);
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
		Cubits.partners.init([PartnerType.Supplier]);
		Cubits.items.init();
	}, []);

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Create) return;
		if (entity.value.id.value)
		{
			isLoading.value = true;
			const load = async () =>
			{
				let res: RequestResult<PurchaseInvoiceDto>;
				if (entity.value.invoiceMode.value !== PurchaseInvoiceMode.Return)
				{
					res = await Services.purchaseInvoicesApi.Get(entity.value.id.value);
				}
				else
				{
					res = await Services.purchaseInvoicesApi.GetReturnInvoiceInitialDetails(entity.value.id.value);
				}
				if (res?.data)
				{
					if (entity.value.invoiceMode.value === PurchaseInvoiceMode.Normal)
					{
						entity.value = PurchaseInvoice.load(res.data);
					}
					else if (entity.value.invoiceMode.value === PurchaseInvoiceMode.Return)
					{
						res.data.originalPurchaseInvoiceId = entity.value.id.value;
						res.data.type = PurchaseInvoiceType.CreditNote;
						res.data.paymentVouchers = res.data.paymentVouchers.map((v) => ({...v, id: 0}));
						entity.value = PurchaseInvoice.create(res.data);
						entity.value.invoiceMode.value = PurchaseInvoiceMode.Return;
						entity.value.syncPaymentVouchers();
					}
					else if (entity.value.invoiceMode.value === PurchaseInvoiceMode.Copy)
					{
						res.data.id = 0;
						res.data.idempotencyKey = crypto.randomUUID();
						entity.value = PurchaseInvoice.create(res.data);
						entity.value.invoiceMode.value = PurchaseInvoiceMode.Copy;
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
			return {canBeImportInvoice: false};
		}
		return {canBeImportInvoice: partnerCountryId !== settingsCountryId};
	});

	const transformDataBeforeSave = async (data: PurchaseInvoiceDto): Promise<PurchaseInvoiceDto> =>
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
		data.files = await commitFiles(entity.value.files.value, "PurchaseInvoices");
		return data;
	};

	const getDialogTitle = () =>
	{
		if (entity.value.invoiceMode.value === PurchaseInvoiceMode.Return)
		{
			return "إضافة إشعار دائن لمورد (مرتجع مشتريات)";
		}
		if (entity.value.mode.value === ChangeableEntityMode.Create)
		{
			return `إضافة ${ getPurchaseInvoiceTypeName(entity.value.type.value, t) }`;
		}
		return `تعديل ${ getPurchaseInvoiceTypeName(entity.value.type.value, t) }`;
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
											label={ t("vouchers.supplier", "المورد") }
											required
											error={ entity.value.getError("partnerId") }
										>
											<PartnersSearchableSelect
												id={ entity.value.partnerId }
												label={ entity.value.partnerName }
												disabled={ entity.value.isDisabled }
												types={ [PartnerType.Supplier] }
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
											value={ entity.value.originalPurchaseInvoiceId }
										/>
										<TextField
											label="رقم فاتورة المورد"
											value={ entity.value.vendorInvoiceNumber }
										/>
										<DateField
											label="تاريخ فاتورة المورد"
											value={ entity.value.vendorInvoiceDate }
										/>
										{ invoiceOrigin.value.canBeImportInvoice && (
											<SelectField<ImportExportType>
												label={ t("invoices.importInvoice") }
												required
												value={ entity.value.importExportType }
												error={ entity.value.getError("importExportType") }
												options={ [
													{
														label: t("invoices.importReverseCharge"),
														value: ImportExportType.ImportAccordingToTheReverseChargeMechanism
													},
													{
														label: t("invoices.importCustomsPaid"),
														value: ImportExportType.ImportPaidForCustoms
													}
												] }
											/>
										) }
										<div className="col-span-1 md:col-span-2 lg:col-span-4">
											<TextField label={ t("invoices.notes") } value={ entity.value.notes }/>
										</div>
									</FieldsSection>

									{ !entity.value.isDisabled && entity.value.invoiceMode.value !== PurchaseInvoiceMode.Return && (
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
										isSalesDocument={ false }
										showCostColumn={ false }
										allowReturnQuantityConstraint={ entity.value.invoiceMode.value === PurchaseInvoiceMode.Return }
									/>
								</div>

								<div className="xl:col-span-4 2xl:col-span-3">
									<div className="sticky top-4 space-y-4">
										{ Services.auth.hasAuth(
											SystemPermissionsResources.InvoiceAddSettlement,
											SystemPermissionsActions.Get
										) && <CommercialGlobalSettlement document={ entity.value }/> }

										<CommercialSummaryCard document={ entity.value }/>

										<CommercialPaymentVouchers document={ entity.value }/>
									</div>
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
				<ChangeDialog.SaveButton<PurchaseInvoice, PurchaseInvoiceDto>
					entity={ entity }
					service={ service }
					loadingSignal={ isSaving }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
					transformData={ transformDataBeforeSave }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}