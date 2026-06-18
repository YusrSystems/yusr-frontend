import { BanknoteArrowUp, Box, CheckCircle2, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	Button,
	ChangeDialog,
	type CommonChangeDialogProps,
	DialogClose,
	DialogFooter,
	Loading,
	type RequestResult,
	StorageType,
	useStorageFile
} from "yusr-ui";
import InvoiceItemsMath from "./logic/invoiceItemsMath";
import InvoiceBasicTab from "./presentation/basic/invoiceBasicTab";
import InvoiceCostsTab from "./presentation/costs/invoiceCostsTab";
import InvoiceFilesTab from "./presentation/files/invoiceFilesTab";
import InvoicePolicyTab from "./presentation/policy/invoicePolicyTab";
import Invoice, { type InvoiceDto, InvoiceMode } from "@/core/data/invoices/invoice.ts";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { AccountType } from "@/core/data/account.ts";
import { InvoiceType } from "@/core/types/invoiceType";
import { ItemType } from "@/core/data/item.ts";
import { Services } from "@/core/services/services.ts";


export default function ChangeInvoiceDialog({
	entity,
	service,
	onSuccess,
	fixedType
}: CommonChangeDialogProps<Invoice, InvoiceDto> & {
	fixedType?: InvoiceType;
})
{
	useSignals();
	const {t} = useTranslation("accounting");
	const navigate = useNavigate();

	const currentEntity = useMemo(() => signal(entity), []);
	const isFullyReturned = useMemo(() => signal(false), []);
	const isLoading = useMemo(() => signal(false), []);

	const {commitFiles} = useStorageFile(
		() => currentEntity.value.invoiceFiles.value ?? [],
		(files) => currentEntity.value.invoiceFiles.value = files,
		StorageType.Private
	);

	useEffect(() =>
	{
		Cubits.accounts.init(fixedType == InvoiceType.Purchase || fixedType == InvoiceType.PurchaseReturn ? [AccountType.Supplier] : [AccountType.Client]);
		Cubits.paymentMethods.init();
		Cubits.stores.init();
	}, [fixedType]);

	useEffect(() =>
	{
		if (fixedType === InvoiceType.Sell && currentEntity.value.storeId.value)
		{
			Cubits.items.init([ItemType.Product, ItemType.Service], {storeId: currentEntity.value.storeId.value});
		}
	}, [fixedType, currentEntity.value.storeId.value]);

	useEffect(() =>
	{
		if (currentEntity.value.mode.value === InvoiceMode.Create)
		{
			if (Services.auth.setting?.invoicePolicy?.value && !currentEntity.value.policy.value)
			{
				currentEntity.value.policy.value = Services.auth.setting?.invoicePolicy?.value;
			}
			return;
		}
		if (currentEntity.value.id.value != undefined)
		{
			isLoading.value = true;

			const getInvoice = async () =>
			{
				let res: RequestResult<Invoice>;
				if (currentEntity.value.mode.value !== InvoiceMode.Return)
				{
					res = await Services.invoicesApi.Get(entity.id.value);
				}
				else
				{
					res = await Services.invoicesApi.GetReturnInvoiceInitialDetails(entity.id.value);
				}

				if (res?.data != undefined)
				{
					if (currentEntity.value.mode.value === InvoiceMode.Update)
					{
						currentEntity.value = Invoice.load(res.data.toJson());
					}
					if (currentEntity.value.mode.value === InvoiceMode.Return)
					{
						res.data.date.value = new Date();
						currentEntity.value = Invoice.load(res.data.toJson());
						currentEntity.value.mode.value = InvoiceMode.Return;
						currentEntity.value.syncPaymentVouchers();
					}
					if (currentEntity.value.mode.value === InvoiceMode.Copy)
					{
						res.data.id.value = 0;
						res.data.date.value = new Date();
						currentEntity.value = Invoice.load(res.data.toJson());
						currentEntity.value.mode.value = InvoiceMode.Copy;
						currentEntity.value.syncPaymentVouchers();
					}
					if (currentEntity.value.mode.value === InvoiceMode.QuotationToSales)
					{
						res.data.id.value = 0;
						res.data.type.value = InvoiceType.Sell;
						res.data.date.value = new Date();
						res.data.notes.value = undefined;
						currentEntity.value = Invoice.load(res.data.toJson());
						currentEntity.value.mode.value = InvoiceMode.QuotationToSales;
						currentEntity.value.syncPaymentVouchers();
					}

					isFullyReturned.value = res.data.invoiceItems.value.length === 0;
				}

				isLoading.value = false;
			};

			void getInvoice();
		}
	}, [entity.id.value, entity.mode.value]);

	const transformDataBeforeSave = async (data: Invoice): Promise<Invoice> =>
	{

		data.fullAmount.value = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(currentEntity.value.invoiceItems.value ?? []);
		data.invoiceItems.value.forEach((ii, index) => ii.index.value = index);

		data.invoiceFiles.value = await commitFiles(
			currentEntity.value.invoiceFiles.value,
			`Invoices`
		);

		if (currentEntity.value.mode.value === InvoiceMode.Return)
		{
			data.type.value = data.type.value === InvoiceType.Sell
				? InvoiceType.SellReturn
				: InvoiceType.PurchaseReturn;
			data.id.value = 0;
		}

		if (currentEntity.value.mode.value === InvoiceMode.Copy || currentEntity.value.mode.value === InvoiceMode.QuotationToSales)
		{
			data.mode.value = InvoiceMode.Create;
			data.id.value = 0;
		}

		return data;
	};

	const isReturn = currentEntity.value.type.value === InvoiceType.SellReturn || currentEntity.value.type.value === InvoiceType.PurchaseReturn;

	const getDialogTitle = () =>
	{
		if (entity.mode.value === InvoiceMode.Return)
		{
			return t("invoices.addReturnInvoice");
		}
		if (entity.mode.value === InvoiceMode.QuotationToSales)
		{
			return t("invoices.convertToSales");
		}
		if (entity.mode.value === InvoiceMode.Copy || entity.mode.value == InvoiceMode.Create)
		{
			return isReturn
				? t("invoices.addReturnInvoice")
				: fixedType === InvoiceType.Quotation
					? t("invoices.addNewQuotationTitle")
					: t("invoices.addInvoice");
		}
		return isReturn
			? t("invoices.editReturnInvoice")
			: fixedType === InvoiceType.Quotation
				? t("invoices.editQuotation")
				: t("invoices.editInvoice");
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

	if (isFullyReturned.value)
	{
		return (
			<ChangeDialog>
				<ChangeDialog.Header title={ getDialogTitle() }/>

				<div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle2 className="h-8 w-8 text-green-600"/>
					</div>
					<h3 className="text-lg font-semibold">{ t("invoices.fullyReturned") }</h3>
					<p className="text-sm text-muted-foreground">{ t("invoices.fullyReturnedMessage") }</p>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">{ t("invoices.close") }</Button>
					</DialogClose>
				</DialogFooter>
			</ChangeDialog>
		);
	}

	return (
		<ChangeDialog className="sm:max-w-[100vw] sm:w-screen sm:h-screen">
			<ChangeDialog.Header title={ getDialogTitle() }/>

			<ChangeDialog.Tabbed
				tabs={ [
					{
						label: t("invoices.basicInfo"),
						icon: Box,
						active: true,
						content: <InvoiceBasicTab invoice={ currentEntity.value }/>
					},
					...(currentEntity.value.type.value !== InvoiceType.Quotation
						? [{
							label: t("invoices.invoiceCosts"),
							icon: BanknoteArrowUp,
							active: false,
							content: <InvoiceCostsTab invoice={ currentEntity.value }/>
						}]
						: []),
					{
						label: t("invoices.invoicePolicy"),
						icon: Siren,
						active: false,
						content: <InvoicePolicyTab invoice={ currentEntity.value }/>
					},
					{
						label: t("invoices.invoiceAttachments"),
						icon: FolderKanban,
						active: false,
						content: <InvoiceFilesTab invoice={ currentEntity.value }/>
					}
				] }
			/>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Invoice, InvoiceDto>
					entity={ currentEntity.value }
					service={ service }
					onSuccess={ (data) =>
					{
						if (entity.mode.value === InvoiceMode.QuotationToSales)
						{
							navigate("/sales");
						}
						onSuccess?.(data);
					} }
					transformData={ transformDataBeforeSave }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
