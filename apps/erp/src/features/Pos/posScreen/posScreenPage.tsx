import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { AlertCircle, ArrowRight, Loader2, LogOut, MonitorPlay, ReceiptText, ShoppingCart } from "lucide-react";
import { Button, DateService } from "yusr-ui";
import { Services } from "@/core/services/services";
import { PosSessionDto } from "@/core/data/posSession";
import { PosTerminalDto } from "@/core/data/posTerminal";
import CloseSessionDialog from "../posSession/closeSessionDialog";
import { APP_NAME } from "../../../../appConfig";
import { SalesInvoice, type SalesInvoiceDto, SalesInvoiceMode } from "@/core/data/commercial/salesInvoice";
import { SalesInvoiceType } from "@/core/types/commercialEnums";

import PosProductGrid from "./components/posProductGrid";
import PosCart from "./components/posCart";
import PosCheckoutDialog from "./components/posCheckoutDialog";
import PosRecentInvoicesDialog from "./components/posRecentInvoicesDialog";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport.tsx";
import type { SalesInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";
import { PosTempCache } from "@/features/Pos/posTempCache.ts";


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

	const cartInvoice = useMemo(() => signal<SalesInvoice | null>(null), []);
	const printedInvoice = useMemo(() => signal<SalesInvoiceReportResult | undefined>(undefined), []);

	useEffect(() =>
	{
		const handleAfterPrint = () =>
		{
			printedInvoice.value = undefined;
		};
		window.addEventListener("afterprint", handleAfterPrint);
		return () => window.removeEventListener("afterprint", handleAfterPrint);
	}, [printedInvoice]);

	const triggerImmediatePrint = (report: SalesInvoiceReportResult) =>
	{
		printedInvoice.value = report;
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
		if (!activeTerminal.value) return;

		const channel = new BroadcastChannel(`pos_customer_channel_${ activeTerminal.value.id }`);
		const invoice = cartInvoice.value;

		if (!invoice || invoice.items.value.length === 0)
		{
			channel.postMessage({type: "RESET", items: [], totalAmount: 0});
			return;
		}

		const items = invoice.items.value.map((i) => ({
			name: i.itemName.value,
			quantity: Number(i.quantity.value),
			unitPrice: Number(i.taxInclusivePrice.value),
			totalPrice: Number(i.taxInclusiveTotalPrice.value),
			unitName: i.unitName.value
		}));

		const finalTotal = invoice.fullAmount.value;
		const mainTaxPerc = Number(Services.auth.setting?.mainTax?.value?.percentage) || 0;
		const baseTaxExclusive = mainTaxPerc > 0 ? finalTotal / (1 + mainTaxPerc / 100) : finalTotal;
		const baseTaxAmount = finalTotal - baseTaxExclusive;

		channel.postMessage({
			type: "CART_UPDATED",
			items,
			totalAmount: finalTotal,
			totalTax: baseTaxAmount,
			discount: invoice.settlementAmount.value,
			invoiceType: invoice.type.value
		});

		return () => channel.close();
	}, [
		cartInvoice.value,
		cartInvoice.value?.items.value,
		cartInvoice.value?.items.value.map((i) => i.quantity.value + i.taxInclusiveTotalPrice.value).join(","),
		cartInvoice.value?.settlementAmount.value
	]);

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
				// 1. Check cache first
				const cachedSession = PosTempCache.getSession(terminalId);
				const cachedTerminal = PosTempCache.getTerminal(terminalId);

				// 2. Only fetch missing endpoints
				const promises: [
						Promise<{ data?: PosSessionDto }> | null,
						Promise<{ data?: PosTerminalDto }> | null
				] = [
					cachedSession === undefined ? Services.posSessionsApi.GetActiveSession(terminalId) : null,
					!cachedTerminal ? Services.posTerminalsApi.Get(terminalId) : null
				];

				const [sessionRes, terminalRes] = await Promise.all([
					promises[0] ? promises[0] : Promise.resolve({data: cachedSession ?? undefined}),
					promises[1] ? promises[1] : Promise.resolve({data: cachedTerminal ?? undefined})
				]);

				const session = sessionRes?.data ?? cachedSession ?? null;
				const terminal = terminalRes?.data ?? cachedTerminal ?? null;

				// Update cache if fetched from API
				if (sessionRes?.data !== undefined)
				{
					PosTempCache.setSession(terminalId, sessionRes.data ?? null);
				}
				if (terminalRes?.data)
				{
					PosTempCache.setTerminal(terminalRes.data);
				}

				if (session && terminal)
				{
					activeSession.value = session;
					activeTerminal.value = terminal;

					const openedDate = new Date(session.openedAt).toDateString();
					const today = new Date().toDateString();

					if (openedDate !== today)
					{
						isOutdatedSession.value = true;
						isCloseDialogOpen.value = true;
					}

					initNewCart(terminal, session.id);
				}
				else
				{
					navigate("/pos", {replace: true});
				}
			}
			catch (error)
			{
				console.error("Error loading session or terminal:", error);
				navigate("/pos", {replace: true});
			}
			finally
			{
				isLoading.value = false;
			}
		};

		fetchSessionAndTerminal();
	}, [terminalIdParam]);

	const initNewCart = (terminal: PosTerminalDto, sessionId?: number) =>
	{
		cartInvoice.value = SalesInvoice.create({
			type: SalesInvoiceType.Invoice,
			storeId: terminal.storeId,
			storeName: terminal.storeName,
			partnerId: terminal.defaultPartnerId ?? Services.auth.setting?.defaultCustomerPartnerId?.value,
			partnerName: terminal.defaultPartnerName ?? Services.auth.setting?.defaultCustomerPartnerName?.value,
			posSessionId: sessionId ?? activeSession.value?.id
		});
	};

	const handleProcessReturn = (invoiceDto: SalesInvoiceDto) =>
	{
		if (!activeTerminal.value) return;

		const fetchReturnDetails = async () =>
		{
			const res = await Services.salesInvoicesApi.GetReturnInvoiceInitialDetails(invoiceDto.id);

			if (res.data)
			{
				const returnDetails = res.data;

				returnDetails.date = DateService.formatDateOnly(new Date());
				returnDetails.originalSalesInvoiceId = invoiceDto.id;
				returnDetails.type = SalesInvoiceType.CreditNote;
				returnDetails.posSessionId = activeSession.value?.id;
				returnDetails.costVouchers = [];
				returnDetails.paymentVouchers = (returnDetails.paymentVouchers ?? []).map((v) => ({...v, id: 0}));

				const returnInvoice = SalesInvoice.create(returnDetails);
				returnInvoice.invoiceMode.value = SalesInvoiceMode.Return;

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
							onClick={ () => (isCloseDialogOpen.value = true) }
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
						className="gap-2 h-9 text-xs"
						onClick={ () =>
						{
							window.open(
								`/pos/customer/${ activeTerminal.value?.id }`,
								`pos_customer_display_${ activeTerminal.value?.id }`,
								"width=1024,height=768,menubar=no,toolbar=no,location=no,status=no"
							);
						} }
						title="فتح شاشة العميل في شاشة منفصلة"
					>
						<MonitorPlay className="w-4 h-4 text-primary"/>
						شاشة العميل
					</Button>

					<Button
						variant="outline"
						className="gap-2 h-9"
						onClick={ () => (isRecentInvoicesDialogOpen.value = true) }
						disabled={ isOutdatedSession.value }
					>
						<ReceiptText className="w-4 h-4 text-primary"/>
						الفواتير الأخيرة
					</Button>

					<Button
						variant="destructive"
						className="gap-2 h-9"
						onClick={ () => (isCloseDialogOpen.value = true) }
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
							if (cartInvoice.value?.type.value === SalesInvoiceType.CreditNote)
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
				onOpenChange={ (open) => (isCloseDialogOpen.value = open) }
				session={ activeSession.value }
				onSuccess={ () =>
				{
					navigate("/pos", {replace: true});
				} }
			/>

			{ isCheckoutDialogOpen.value && (
				<PosCheckoutDialog
					open={ isCheckoutDialogOpen.value }
					onOpenChange={ (open) => (isCheckoutDialogOpen.value = open) }
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

							// Notify Customer Screen about Payment Success & Change
							const channel = new BroadcastChannel(`pos_customer_channel_${ activeTerminal.value!.id }`);
							channel.postMessage({
								type: "CHECKOUT_COMPLETED",
								totalAmount: reportResult.totalAfterTax,
								tenderedAmount: reportResult.tenderedAmount,
								changeAmount: reportResult.changeAmount
							});

							// Reset to Idle after 8 seconds
							setTimeout(() =>
							{
								channel.postMessage({type: "RESET", items: [], totalAmount: 0});
								channel.close();
							}, 8000);
						}
					} }
				/>
			) }

			{ isRecentInvoicesDialogOpen.value && (
				<PosRecentInvoicesDialog
					open={ isRecentInvoicesDialogOpen.value }
					onOpenChange={ (open) => (isRecentInvoicesDialogOpen.value = open) }
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