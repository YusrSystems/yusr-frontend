import { Box, FolderKanban, Siren } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldsSection,
	FormField,
	Loading,
	SelectField,
	StorageType,
	SystemPermissionsActions,
	TextAreaField,
	TextField,
	useStorageFile
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { PurchaseInvoice, PurchaseInvoiceDto, PurchaseInvoiceMode } from "@/core/data/commercial/purchaseInvoice";
import { getPurchaseInvoiceTypeName, PurchaseInvoiceType } from "@/core/types/commercialEnums";
import { PartnerDto, PartnerType } from "@/core/data/partner";
import { ImportExportType } from "@/core/types/importExportType";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import { PurchaseInvoicesSearchableSelect } from "@/core/components/searchableSelect/purchaseInvoicesSearchableSelect";
import StoreItemSelector from "@/features/items/storeItemSelector";
import { CommercialItemsTable } from "../components/commercialItemsTable";
import { CommercialGlobalSettlement } from "../components/commercialGlobalSettlement";
import { CommercialSummaryCard } from "../components/commercialSummaryCard";
import { CommercialPolicyTab } from "../components/commercialPolicyTab";
import { CommercialAttachmentsTab } from "../components/commercialAttachmentsTab";
import { CommercialPaymentVouchers } from "../components/commercialPaymentVouchers";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { useInvoiceOrigin } from "../hooks/useInvoiceOrigin";
import { useStoreItemsSync } from "../hooks/useStoreItemsSync";
import { useCommercialUrlLoader } from "../hooks/useCommercialUrlLoader";
import { prepareCommercialPayload } from "../logic/commercialPayload";


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

	const canAdd = Services.auth.hasAuth(SystemPermissionsResources.Invoices, SystemPermissionsActions.Add);
	const canUpdate = Services.auth.hasAuth(SystemPermissionsResources.Invoices, SystemPermissionsActions.Update);

	const {returnFromId, copyFromId} = useCommercialUrlLoader<PurchaseInvoiceDto>({
		mode: entity.value.mode,
		isLoading,
		hasAddAuth: canAdd,
		fetchReturnDetails: (id) => Services.purchaseInvoicesApi.GetReturnInvoiceInitialDetails(id),
		fetchCopyDetails: (id) => Services.purchaseInvoicesApi.Get(id),
		onLoadReturn: (data) => entity.value.loadFromReturn(data),
		onLoadCopy: (data) => entity.value.loadFromCopy(data)
	});

	useStoreItemsSync(
		entity.value.storeId,
		entity.value.isDisabled,
		entity.value.mode.value === ChangeableEntityMode.Create ? canAdd : canUpdate
	);

	const invoiceOrigin = useInvoiceOrigin(selectedPartner);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create && !canAdd) ||
		(entity.value.mode.value === ChangeableEntityMode.Update && !canUpdate)
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const transformDataBeforeSave = async (): Promise<PurchaseInvoiceDto> =>
	{
		return prepareCommercialPayload(entity.value, commitFiles, "PurchaseInvoices");
	};

	const getDialogTitle = () =>
	{
		if (returnFromId || entity.value.invoiceMode.value === PurchaseInvoiceMode.Return)
		{
			return "إضافة إشعار دائن لمورد (مرتجع مشتريات)";
		}
		if (copyFromId)
		{
			return `نسخ فاتورة الشراء #${ copyFromId }`;
		}
		if (entity.value.mode.value === ChangeableEntityMode.Create)
		{
			return `إضافة ${ getPurchaseInvoiceTypeName(entity.value.type.value, t) }`;
		}
		return `تعديل ${ getPurchaseInvoiceTypeName(entity.value.type.value, t) }`;
	};

	const handleSelectOriginalInvoice = async (originalInvoice?: PurchaseInvoiceDto) =>
	{
		if (!originalInvoice)
		{
			entity.value.originalPurchaseInvoiceId.value = undefined;
			return;
		}

		if (entity.value.type.value === PurchaseInvoiceType.CreditNote)
		{
			isLoading.value = true;
			try
			{
				const res = await Services.purchaseInvoicesApi.GetReturnInvoiceInitialDetails(originalInvoice.id);
				if (res?.data)
				{
					entity.value.loadFromReturn(res.data);
				}
			}
			finally
			{
				isLoading.value = false;
			}
		}
		else if (entity.value.type.value === PurchaseInvoiceType.DebitNote)
		{
			entity.value.originalPurchaseInvoiceId.value = originalInvoice.id;
			entity.value.storeId.value = originalInvoice.storeId;
			entity.value.storeName.value = originalInvoice.storeName;
			entity.value.partnerId.value = originalInvoice.partnerId;
			entity.value.partnerName.value = originalInvoice.partnerName;
			entity.value.vendorInvoiceNumber.value = originalInvoice.vendorInvoiceNumber;
			entity.value.vendorInvoiceDate.value = originalInvoice.vendorInvoiceDate;
		}
	};

	if (isLoading.value || (entity.value.mode.value === ChangeableEntityMode.Update && entity.value.items.value.length <= 0))
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

	const isCreditOrDebit =
		entity.value.type.value === PurchaseInvoiceType.CreditNote ||
		entity.value.type.value === PurchaseInvoiceType.DebitNote;

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
											disabled={ entity.value.isDisabled }
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
										{ isCreditOrDebit && !returnFromId && (
											entity.value.mode.value === ChangeableEntityMode.Create ? (
												<FormField
													label={ t("invoices.relatedInvoiceNumber") }
													required
												>
													<PurchaseInvoicesSearchableSelect
														id={ entity.value.originalPurchaseInvoiceId }
														label={ signal(entity.value.originalPurchaseInvoiceId.value ? `#${ entity.value.originalPurchaseInvoiceId.value }` : undefined) }
														onSelect={ handleSelectOriginalInvoice }
														cubit={ Cubits.originalPurchaseInvoices }
													/>
												</FormField>
											) : (
												<TextField
													label={ t("invoices.relatedInvoiceNumber") }
													disabled
													value={ entity.value.originalPurchaseInvoiceId }
												/>
											)
										) }
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
												disabled={ entity.value.isDisabled }
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
											<TextAreaField
												label={ t("invoices.notes") }
												value={ entity.value.notes }
												collapsible
												collapsedHeight={ 60 }
											/>
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
										type="purchases"
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