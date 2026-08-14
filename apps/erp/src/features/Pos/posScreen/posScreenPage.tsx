import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { AlertCircle, ArrowRight, Loader2, LogOut, ReceiptText, ShoppingCart } from "lucide-react";
import { Button, DateService } from "yusr-ui";
import { Services } from "@/core/services/services";
import { PosSessionDto } from "@/core/data/posSession";
import { PosTerminalDto } from "@/core/data/posTerminal";
import CloseSessionDialog from "../posSession/closeSessionDialog";
import { APP_NAME } from "../../../../appConfig";
import Invoice, { InvoiceDto, InvoiceMode } from "@/core/data/invoices/invoice";
import { InvoiceType } from "@/core/types/invoiceType";
import { Cubits } from "@/core/services/cubits";
import { ItemType } from "@/core/data/item.ts";
import PosProductGrid from "./components/posProductGrid";
import PosCart from "./components/posCart";
import PosCheckoutDialog from "./components/posCheckoutDialog";
import PosRecentInvoicesDialog from "./components/posRecentInvoicesDialog";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport.tsx";
import type { InvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";


export default function PosScreenPage()
{
	useSignals();
	const navigate = useNavigate();
	const {terminalId: terminalIdParam} = useParams<{ terminalId?: string }>();

	const isLoading = useMemo(() => signal(true), []);
	const activeSession = useMemo(() => signal<PosSessionDto | null>(null), []);
	const activeTerminal = useMemo(() => signal<PosTerminalDto | null>(null), []);
	const isCloseDialogOpen = useMemo(() => signal(false), []);
	const isCheckoutDialogOpen = useMemo(() => signal(false), []);
	const isRecentInvoicesDialogOpen = useMemo(() => signal(false), []);
	const isOutdatedSession = useMemo(() => signal(false), []);

	// We use the Invoice class to handle all cart math automatically
	const cartInvoice = useMemo(() => signal<Invoice | null>(null), []);
	const printedInvoice = useMemo(() => signal<InvoiceReportResult | undefined>(undefined), []);

	useEffect(() =>
	{
		const handleAfterPrint = () =>
		{
			printedInvoice.value = undefined;
		};
		window.addEventListener("afterprint", handleAfterPrint);
		return () => window.removeEventListener("afterprint", handleAfterPrint);
	}, [printedInvoice]);

	const triggerImmediatePrint = (report: InvoiceReportResult) =>
	{
		printedInvoice.value = report;
		// Wait for DOM to render the portal before triggering print dialog
		requestAnimationFrame(() =>
		{
			requestAnimationFrame(() =>
			{
				window.print();
			});
		});
	};

	useEffect(() =>
	{
		document.title = `نقطة البيع | ${ APP_NAME }`;

		const fetchSessionAndTerminal = async () =>
		{
			if (!terminalIdParam)
			{
				navigate("/pos", {replace: true});
				return;
			}

			const terminalId = Number(terminalIdParam);
			if (Number.isNaN(terminalId) || terminalId <= 0)
			{
				navigate("/pos", {replace: true});
				return;
			}

			try
			{
				const [sessionRes, terminalRes] = await Promise.all([
					Services.posSessionsApi.GetActiveSession(terminalId),
					Services.posTerminalsApi.Get(terminalId)
				]);

				if (sessionRes.data && terminalRes.data)
				{
					activeSession.value = sessionRes.data;
					activeTerminal.value = terminalRes.data;

					const openedDate = new Date(sessionRes.data.openedAt).toDateString();
					const today = new Date().toDateString();

					if (openedDate !== today)
					{
						isOutdatedSession.value = true;
						isCloseDialogOpen.value = true;
					}

					// Initialize items for this store
					Cubits.items.initForStoreAndDate(
						[ItemType.Product, ItemType.Service],
						terminalRes.data.storeId,
						DateService.formatDateOnly(new Date())
					);

					// Initialize empty cart
					initNewCart(terminalRes.data);
				}
				else
				{
					navigate("/pos", {replace: true});
				}
			}
			catch
			{
				navigate("/pos", {replace: true});
			}
			finally
			{
				isLoading.value = false;
			}
		};

		fetchSessionAndTerminal();
	}, [navigate, terminalIdParam]);

	const initNewCart = (terminal: PosTerminalDto) =>
	{
		cartInvoice.value = Invoice.create({
			type: InvoiceType.Sell,
			storeId: terminal.storeId,
			storeName: terminal.storeName,
			partnerId: terminal.defaultPartnerId ?? Services.auth.setting?.defaultCustomerPartnerId?.value,
			partnerName: terminal.defaultPartnerName ?? Services.auth.setting?.defaultCustomerPartnerName?.value
		});
	};

	// Process Receipt-Linked Return Flow (No full-screen reload)
	const handleProcessReturn = (invoiceDto: InvoiceDto) =>
	{
		if (!activeTerminal.value) return;

		const fetchReturnDetails = async () =>
		{
			const res = await Services.invoicesApi.GetReturnInvoiceInitialDetails(invoiceDto.id);

			if (res.data)
			{
				const returnDetails = res.data;

				// Construct return invoice instance
				returnDetails.date = DateService.formatDateOnly(new Date());
				returnDetails.originalInvoiceId = invoiceDto.id;
				returnDetails.type = InvoiceType.SellReturn;
				returnDetails.costVouchers = [];
				returnDetails.paymentVouchers = returnDetails.paymentVouchers.map(v => ({...v, id: 0}));

				const returnInvoice = Invoice.create(returnDetails);
				returnInvoice.invoiceMode.value = InvoiceMode.Return;

				cartInvoice.value = returnInvoice;
				return `تم تحميل مواد الفاتورة #${ invoiceDto.id } لإتمام المرتجع`;
			}
			throw new Error();
		};

		toast.promise(fetchReturnDetails(), {
			loading: "جاري جلب تفاصيل الفاتورة الأصلية...",
			success: (msg) => msg
		});
	};

	// Clear Return Mode and reset back to standard New Sale cart
	const handleCancelReturn = () =>
	{
		if (activeTerminal.value)
		{
			initNewCart(activeTerminal.value);
			toast.success("تم إلغاء وضع المرتجع والعودة للمبيعات العادية");
		}
	};

	if (isLoading.value || !activeSession.value || !activeTerminal.value || !cartInvoice.value)
	{
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="w-10 h-10 animate-spin text-primary"/>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-muted/10 overflow-hidden relative" dir="rtl">
			{/* Outdated Session Overlay / Blocker */ }
			{ isOutdatedSession.value && (
				<div
					className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
					<div
						className="max-w-md bg-card border border-destructive/30 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4">
						<div
							className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
							<AlertCircle className="w-8 h-8"/>
						</div>
						<h2 className="text-xl font-bold text-destructive">الوردية من يوم سابق</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							هذه الوردية تم إفتتاحها في تاريخ سابق ولم يتم إغلاقها بعد. يجب إغلاق الوردية السابقة للتمكن
							من متابعة العمل.
						</p>
						<Button
							size="lg"
							variant="destructive"
							className="w-full h-12 font-bold gap-2 text-base mt-2"
							onClick={ () => isCloseDialogOpen.value = true }
						>
							<LogOut className="w-5 h-5"/>
							إغلاق الوردية الآن
						</Button>
					</div>
				</div>
			) }

			<header
				className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shadow-sm shrink-0 z-10">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={ () => navigate("/dashboard") }>
						<ArrowRight className="w-5 h-5"/>
					</Button>
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
							<ShoppingCart className="w-4 h-4"/>
						</div>
						<div className="flex flex-col">
							<span
								className="font-bold text-sm leading-none">{ activeSession.value.posTerminalName }</span>
							<span
								className="text-xs text-muted-foreground mt-1">{ activeSession.value.cashierUsername }</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="gap-2 h-9"
						onClick={ () => isRecentInvoicesDialogOpen.value = true }
						disabled={ isOutdatedSession.value }
					>
						<ReceiptText className="w-4 h-4 text-primary"/>
						الفواتير الأخيرة
					</Button>

					<Button
						variant="destructive"
						className="gap-2 h-9"
						onClick={ () => isCloseDialogOpen.value = true }
					>
						<LogOut className="w-4 h-4"/>
						إغلاق الوردية
					</Button>
				</div>
			</header>

			<main className="flex-1 flex overflow-hidden">
				{/* Left Side: Products Grid */ }
				<div className="flex-1 flex flex-col overflow-hidden border-l border-border">
					<PosProductGrid
						terminal={ activeTerminal.value }
						onAddItem={ (item, uomId, pmId) =>
						{
							if (isOutdatedSession.value)
							{
								toast.error("يجب إغلاق الوردية السابقة أولاً");
								return;
							}
							if (cartInvoice.value?.type.value === InvoiceType.SellReturn)
							{
								toast.error("لا يمكن إضافة منتجات جديدة في وضع المرتجع. يرجى إلغاء المرتجع أولاً.");
								return;
							}
							cartInvoice.value?.addItem(item, uomId, pmId);
						} }
					/>
				</div>

				{/* Right Side: Cart */ }
				<div className="w-[400px] flex flex-col bg-card shrink-0 shadow-xl z-10">
					<PosCart
						invoice={ cartInvoice.value }
						onCheckout={ () =>
						{
							if (isOutdatedSession.value)
							{
								toast.error("يجب إغلاق الوردية السابقة أولاً");
								return;
							}
							isCheckoutDialogOpen.value = true;
						} }
						onCancelReturn={ handleCancelReturn }
					/>
				</div>
			</main>

			<CloseSessionDialog
				open={ isCloseDialogOpen.value }
				onOpenChange={ (open) => isCloseDialogOpen.value = open }
				session={ activeSession.value }
				onSuccess={ () =>
				{
					navigate("/pos", {replace: true});
				} }
			/>

			{ isCheckoutDialogOpen.value && (
				<PosCheckoutDialog
					open={ isCheckoutDialogOpen.value }
					onOpenChange={ (open) => isCheckoutDialogOpen.value = open }
					invoice={ cartInvoice.value }
					terminal={ activeTerminal.value }
					session={ activeSession.value }
					onSuccess={ (reportResult) =>
					{
						initNewCart(activeTerminal.value!);
						isCheckoutDialogOpen.value = false;

						if (reportResult)
						{
							triggerImmediatePrint(reportResult);
						}
					} }
				/>
			) }

			{ isRecentInvoicesDialogOpen.value && (
				<PosRecentInvoicesDialog
					open={ isRecentInvoicesDialogOpen.value }
					onOpenChange={ (open) => isRecentInvoicesDialogOpen.value = open }
					terminal={ activeTerminal.value }
					session={ activeSession.value }
					onProcessReturn={ handleProcessReturn }
				/>
			) }

			{ printedInvoice.value &&
				createPortal(
					<PortalReportContainer>
						<InvoiceReport data={ printedInvoice.value } isPortal={ true } forceThermal={ true }/>
					</PortalReportContainer>,
					document.body
				)
			}
		</div>
	);
}