import { Box, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldsSection,
	FormField,
	Loading,
	type RequestResult,
	StorageType,
	SystemPermissionsActions,
	TextAreaField,
	useStorageFile
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Quotation, QuotationDto } from "@/core/data/commercial/quotation";
import { ItemType } from "@/core/data/item";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import StoreItemSelector from "@/features/items/storeItemSelector";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { CommercialMath } from "@/features/commercial/logic/commercialMath";
import { CommercialGlobalSettlement } from "@/features/commercial/components/commercialGlobalSettlement";
import { CommercialSummaryCard } from "@/features/commercial/components/commercialSummaryCard";
import { CommercialPolicyTab } from "@/features/commercial/components/commercialPolicyTab";
import { CommercialAttachmentsTab } from "@/features/commercial/components/commercialAttachmentsTab";
import { CommercialItemsTable } from "@/features/commercial/components/commercialItemsTable";


export default function ChangeQuotationDialog({
	dto,
	service,
	onSuccess
}: CommonChangeDialogProps<QuotationDto>)
{
	useSignals();
	const {t} = useTranslation("accounting");
	const [searchParams] = useSearchParams();
	const copyFromId = searchParams.get("copyFromId");

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
		if (entity.value.mode.value === ChangeableEntityMode.Create && copyFromId && Number(copyFromId) > 0)
		{
			isLoading.value = true;
			const loadCopy = async () =>
			{
				try
				{
					const res: RequestResult<QuotationDto> = await service.Get(Number(copyFromId));
					if (res?.data)
					{
						entity.value.loadFromCopy(res.data);
					}
				}
				finally
				{
					isLoading.value = false;
				}
			};
			void loadCopy();
		}
	}, [copyFromId, service]);

	const currentStoreId = entity.value.storeId.value;
	useEffect(() =>
	{
		if (currentStoreId && !entity.value.isDisabled)
		{
			Cubits.items.init([ItemType.Product, ItemType.Service], {storeId: currentStoreId});
		}
	}, [currentStoreId]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create &&
			!Services.auth.hasAuth(SystemPermissionsResources.Quotations, SystemPermissionsActions.Add)) ||
		(entity.value.mode.value === ChangeableEntityMode.Update &&
			!Services.auth.hasAuth(SystemPermissionsResources.Quotations, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

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

	const title = copyFromId
		? `نسخ عرض السعر #${ copyFromId }`
		: entity.value.mode.value === ChangeableEntityMode.Create
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
											label={ "تاريخ عرض السعر" }
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
										<DateField
											label="تاريخ الانتهاء (الصلاحية)"
											value={ entity.value.expiryDate }
											disabled={ entity.value.isDisabled }
										/>
										<DateField
											label="تاريخ التوريد المتوقع"
											value={ entity.value.deliveryDate }
											disabled={ entity.value.isDisabled }
										/>
										<div className="col-span-1 md:col-span-2 lg:col-span-4">
											<TextAreaField
												label={ t("invoices.notes") }
												value={ entity.value.notes }
												collapsible
												collapsedHeight={ 60 }
											/>
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
										type="quotations"
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