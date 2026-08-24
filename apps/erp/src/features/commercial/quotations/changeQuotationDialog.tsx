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
	SelectField,
	StorageType,
	SystemPermissionsActions,
	TextField,
	useStorageFile
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Quotation, QuotationDto } from "@/core/data/commercial/quotation";
import { QuotationStatus } from "@/core/types/commercialEnums";
import { ItemType } from "@/core/data/item";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import StoreItemSelector from "@/features/items/storeItemSelector";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { CommercialMath } from "@/features/commercial/logic/commercialMath.ts";
import { CommercialGlobalSettlement } from "@/features/commercial/components/commercialGlobalSettlement.tsx";
import { CommercialSummaryCard } from "@/features/commercial/components/commercialSummaryCard.tsx";
import { CommercialPolicyTab } from "@/features/commercial/components/commercialPolicyTab.tsx";
import { CommercialAttachmentsTab } from "@/features/commercial/components/commercialAttachmentsTab.tsx";
import { CommercialItemsTable } from "@/features/commercial/components/commercialItemsTable.tsx";


export default function ChangeQuotationDialog({
	dto,
	service,
	onSuccess
}: CommonChangeDialogProps<QuotationDto>)
{
	useSignals();
	const {t} = useTranslation("accounting");
	const entity = useMemo(() => signal(dto ? Quotation.load(dto) : Quotation.create()), [dto]);
	const isLoading = useMemo(() => signal(false), []);
	const isSaving = useMemo(() => signal(false), []);

	const {commitFiles} = useStorageFile(
		() => entity.value.files.value ?? [],
		(files) => (entity.value.files.value = files),
		StorageType.Private
	);

	useEffect(() =>
	{
		Cubits.stores.init();
		Cubits.partners.init([PartnerType.Customer]);
		Cubits.items.init();
	}, []);

	useEffect(() =>
	{
		if (entity.value.storeId.value)
		{
			Cubits.items.init([ItemType.Product, ItemType.Service], {storeId: entity.value.storeId.value});
		}
	}, [entity.value.storeId.value]);

	const transformDataBeforeSave = async (data: QuotationDto): Promise<QuotationDto> =>
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
		data.files = await commitFiles(entity.value.files.value, "Quotations");
		return data;
	};

	const title =
		entity.value.mode.value === ChangeableEntityMode.Create
			? t("invoices.addNewQuotationTitle")
			: t("invoices.editQuotation");

	if (isLoading.value)
	{
		return (
			<ChangeDialog>
				<ChangeDialog.Header title={ title }/>
				<Loading entityName="عرض السعر"/>
			</ChangeDialog>
		);
	}

	const basicHasError = entity.value.hasErrors || entity.value.items.value.some((t) => t.hasErrors);

	return (
		<ChangeDialog className="sm:max-w-[100vw] sm:w-screen sm:h-screen">
			<ChangeDialog.Header title={ title }/>
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
										<DateField label="تاريخ الانتهاء (الصلاحية)" value={ entity.value.expiryDate }/>
										<DateField label="تاريخ التوريد المتوقع" value={ entity.value.deliveryDate }/>
										<FormField
											label={ t("invoices.store") }
											required
											error={ entity.value.getError("storeId") }
										>
											<StoresSearchableSelect
												id={ entity.value.storeId }
												label={ entity.value.storeName }
												disabled={ entity.value.isDisabled }
												onSelect={ () => (entity.value.items.value = []) }
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
											/>
										</FormField>
										<TextField label="مندوب المبيعات" value={ entity.value.delegateEmp }/>
										<SelectField<QuotationStatus>
											label="حالة عرض السعر"
											value={ entity.value.status }
											options={ [
												{label: "ساري (Active)", value: QuotationStatus.Active},
												{label: "تمت الفوترة (Converted)", value: QuotationStatus.Converted},
												{label: "ملغي (Cancelled)", value: QuotationStatus.Cancelled}
											] }
										/>
										<div className="col-span-1 md:col-span-2 lg:col-span-4">
											<TextField label={ t("invoices.notes") } value={ entity.value.notes }/>
										</div>
									</FieldsSection>

									{ !entity.value.isDisabled && (
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
										isSalesDocument={ true }
										showCostColumn={ true }
									/>
								</div>

								<div className="xl:col-span-4 2xl:col-span-3">
									<div className="sticky top-4 space-y-4">
										{ Services.auth.hasAuth(
											SystemPermissionsResources.InvoiceAddSettlement,
											SystemPermissionsActions.Get
										) && <CommercialGlobalSettlement document={ entity.value }/> }

										<CommercialSummaryCard document={ entity.value } showPaymentSummary={ false }/>
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
				<ChangeDialog.SaveButton<Quotation, QuotationDto>
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