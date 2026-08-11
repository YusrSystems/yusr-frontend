import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { ArrowRight, Loader2, LogOut, ShoppingCart } from "lucide-react";
import { Button, DateService } from "yusr-ui";
import { Services } from "@/core/services/services";
import { PosSessionDto } from "@/core/data/posSession";
import { PosTerminalDto } from "@/core/data/posTerminal";
import CloseSessionDialog from "../posSession/closeSessionDialog";
import { APP_NAME } from "../../../../appConfig";
import Invoice from "@/core/data/invoices/invoice";
import { InvoiceType } from "@/core/types/invoiceType";
import { Cubits } from "@/core/services/cubits";
import { ItemType } from "@/core/data/item";
import PosProductGrid from "./components/posProductGrid";
import PosCart from "./components/posCart";
import PosCheckoutDialog from "./components/posCheckoutDialog";


export default function PosScreenPage()
{
	useSignals();
	const navigate = useNavigate();

	const isLoading = useMemo(() => signal(true), []);
	const activeSession = useMemo(() => signal<PosSessionDto | null>(null), []);
	const activeTerminal = useMemo(() => signal<PosTerminalDto | null>(null), []);
	const isCloseDialogOpen = useMemo(() => signal(false), []);
	const isCheckoutDialogOpen = useMemo(() => signal(false), []);

	// We use the Invoice class to handle all cart math automatically
	const cartInvoice = useMemo(() => signal<Invoice | null>(null), []);

	useEffect(() =>
	{
		document.title = `نقطة البيع | ${ APP_NAME }`;

		const fetchSessionAndTerminal = async () =>
		{
			const terminalIdStr = localStorage.getItem("pos_terminal_id");
			if (!terminalIdStr)
			{
				navigate("/pos", {replace: true});
				return;
			}

			try
			{
				const terminalId = Number(terminalIdStr);
				const [sessionRes, terminalRes] = await Promise.all([
					Services.posSessionsApi.GetActiveSession(terminalId),
					Services.posTerminalsApi.Get(terminalId)
				]);

				if (sessionRes.data && terminalRes.data)
				{
					activeSession.value = sessionRes.data;
					activeTerminal.value = terminalRes.data;

					// Initialize items for this store using DateService to avoid 400 Bad Request
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
	}, [navigate]);

	const initNewCart = (terminal: PosTerminalDto) =>
	{
		const newInvoice = Invoice.create({
			type: InvoiceType.Sell,
			storeId: terminal.storeId,
			storeName: terminal.storeName,
			partnerId: terminal.defaultPartnerId ?? Services.auth.setting?.defaultCustomerPartnerId?.value,
			partnerName: terminal.defaultPartnerName ?? Services.auth.setting?.defaultCustomerPartnerName?.value
		});
		cartInvoice.value = newInvoice;
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
		<div className="h-screen flex flex-col bg-muted/10 overflow-hidden" dir="rtl">
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
							cartInvoice.value?.addItem(item, uomId, pmId);
						} }
					/>
				</div>

				{/* Right Side: Cart */ }
				<div className="w-[400px] flex flex-col bg-card shrink-0 shadow-xl z-10">
					<PosCart
						invoice={ cartInvoice.value }
						onCheckout={ () => isCheckoutDialogOpen.value = true }
					/>
				</div>
			</main>

			<CloseSessionDialog
				open={ isCloseDialogOpen.value }
				onOpenChange={ (open) => isCloseDialogOpen.value = open }
				session={ activeSession.value }
				onSuccess={ () =>
				{
					localStorage.removeItem("pos_terminal_id");
					navigate("/dashboard", {replace: true});
				} }
			/>

			{ isCheckoutDialogOpen.value && (
				<PosCheckoutDialog
					open={ isCheckoutDialogOpen.value }
					onOpenChange={ (open) => isCheckoutDialogOpen.value = open }
					invoice={ cartInvoice.value }
					terminal={ activeTerminal.value }
					session={ activeSession.value }
					onSuccess={ () =>
					{
						initNewCart(activeTerminal.value!);
						isCheckoutDialogOpen.value = false;
					} }
				/>
			) }
		</div>
	);
}