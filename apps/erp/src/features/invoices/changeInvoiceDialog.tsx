import { BanknoteArrowUp, Box, CheckCircle2, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	Button,
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateService,
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
	dto,
	service,
	onSuccess,
	fixedType
}: CommonChangeDialogProps<InvoiceDto> & {
	fixedType?: InvoiceType;
})
{
	useSignals();
	const {t} = useTranslation("accounting");
	const navigate = useNavigate();
	const entity = useMemo(() => signal(dto ? Invoice.load(dto) : Invoice.create({type: fixedType})), []);
	const isFullyReturned = useMemo(() => signal(false), []);
	const isLoading = useMemo(() => signal(false), []);

	const {commitFiles} = useStorageFile(
		() => entity.value.invoiceFiles.value ?? [],
		(files) => entity.value.invoiceFiles.value = files,
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
		if ((fixedType === InvoiceType.Sell || fixedType === InvoiceType.Quotation) && entity.value.storeId.value)
		{
			Cubits.items.init([ItemType.Product, ItemType.Service], {storeId: entity.value.storeId.value});
		}
		else
		{
			Cubits.items.init([ItemType.Product, ItemType.Service]);
		}
	}, [fixedType, entity.value.storeId.value]);

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Create)
		{
			return;
		}

		if (entity.value.id.value != undefined)
		{
			isLoading.value = true;

			const getInvoice = async () =>
			{
				let res: RequestResult<InvoiceDto>;
				if (entity.value.invoiceMode.value !== InvoiceMode.Return)
				{
					res = await Services.invoicesApi.Get(entity.value.id.value);
				}
				else
				{
					res = await Services.invoicesApi.GetReturnInvoiceInitialDetails(entity.value.id.value);
				}

				if (res?.data != undefined)
				{
					if (entity.value.invoiceMode.value === InvoiceMode.Normal)
					{
						entity.value = Invoice.load(res.data);
					}
					else if (entity.value.invoiceMode.value === InvoiceMode.Return)
					{
						res.data.date = DateService.formatDateOnly(new Date());
						res.data.originalInvoiceId = entity.value.id.value;
						res.data.type = res.data.type === InvoiceType.Sell
							? InvoiceType.SellReturn
							: InvoiceType.PurchaseReturn;
						entity.value = Invoice.create(res.data);
						entity.value.invoiceMode.value = InvoiceMode.Return;
						entity.value.syncPaymentVouchers();
					}
					else if (entity.value.invoiceMode.value === InvoiceMode.Copy)
					{
						res.data.id = 0;
						res.data.date = DateService.formatDateOnly(new Date());
						entity.value = Invoice.create(res.data);
						entity.value.invoiceMode.value = InvoiceMode.Copy;
						entity.value.syncPaymentVouchers();
					}
					else if (entity.value.invoiceMode.value === InvoiceMode.QuotationToSales)
					{
						res.data.id = 0;
						res.data.type = InvoiceType.Sell;
						res.data.date = DateService.formatDateOnly(new Date());
						res.data.notes = undefined;
						res.data.policy = Services.auth.setting?.getInvoicePolicy(res.data.type);
						entity.value = Invoice.create(res.data);
						entity.value.invoiceMode.value = InvoiceMode.QuotationToSales;
						entity.value.syncPaymentVouchers();
					}

					isFullyReturned.value = res.data.invoiceItems.length === 0;
				}

				isLoading.value = false;
			};

			void getInvoice();
		}
	}, [entity.value.id.value, entity.value.mode.value]);

	const transformDataBeforeSave = async (data: InvoiceDto): Promise<InvoiceDto> =>
	{
		data.fullAmount = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(entity.value.invoiceItems.value ?? []);
		data.invoiceItems.forEach((ii, index) => ii.index = index);

		data.invoiceFiles = await commitFiles(
			entity.value.invoiceFiles.value,
			`Invoices`
		);

		return data;
	};

	const isReturn = entity.value.type.value === InvoiceType.SellReturn || entity.value.type.value === InvoiceType.PurchaseReturn;

	const getDialogTitle = () =>
	{
		if (entity.value.invoiceMode.value === InvoiceMode.Return)
		{
			return t("invoices.addReturnInvoice");
		}
		if (entity.value.invoiceMode.value === InvoiceMode.QuotationToSales)
		{
			return t("invoices.convertToSales");
		}
		if (entity.value.invoiceMode.value === InvoiceMode.Copy || entity.value.mode.value == ChangeableEntityMode.Create)
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

	const basicHasError = entity.value.hasErrors
		|| entity.value.invoiceItems.value.some((t) => t.hasErrors)
		|| entity.value.paymentVouchers().some((t) => t.hasErrors);

	const costHasError = entity.value.costVouchers().some((t) => t.hasErrors);

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
						content: <InvoiceBasicTab invoice={ entity.value }/>
					},
					...(entity.value.type.value !== InvoiceType.Quotation
						? [{
							label: t("invoices.invoiceCosts"),
							icon: BanknoteArrowUp,
							active: false,
							hasError: costHasError,
							content: <InvoiceCostsTab invoice={ entity.value }/>
						}]
						: []),
					{
						label: t("invoices.invoicePolicy"),
						icon: Siren,
						active: false,
						content: <InvoicePolicyTab invoice={ entity.value }/>
					},
					{
						label: t("invoices.invoiceAttachments"),
						icon: FolderKanban,
						active: false,
						content: <InvoiceFilesTab invoice={ entity.value }/>
					}
				] }
			/>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Invoice, InvoiceDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) =>
					{
						if (entity.value.invoiceMode.value === InvoiceMode.QuotationToSales)
						{
							navigate("/sales");
						}
						onSuccess?.(data, entity.value.mode.value);
					} }
					transformData={ transformDataBeforeSave }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
