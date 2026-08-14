import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { Services } from "@/core/services/services";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { CheckCircle2, ShoppingBag, Store } from "lucide-react";
import { InvoiceType } from "@/core/types/invoiceType";


export interface PosCustomerDisplayMessage
{
	type: "CART_UPDATED" | "CHECKOUT_COMPLETED" | "RESET";
	items?: Array<{
		name: string;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
		unitName?: string;
	}>;
	totalAmount?: number;
	totalTax?: number;
	discount?: number;
	invoiceType?: InvoiceType;
	tenderedAmount?: number;
	changeAmount?: number;
	qrBytes?: string;
}

export default function PosCustomerDisplayPage()
{
	useSignals();
	const {terminalId} = useParams<{ terminalId: string }>();

	const displayState = useMemo(
		() =>
			signal<PosCustomerDisplayMessage>({
				type: "RESET",
				items: [],
				totalAmount: 0
			}),
		[]
	);

	const setting = Services.auth.setting;

	useEffect(() =>
	{
		document.title = "شاشة العميل | Customer Display";

		if (!terminalId) return;

		// Listen to BroadcastChannel for this terminal
		const channel = new BroadcastChannel(`pos_customer_channel_${ terminalId }`);

		channel.onmessage = (event: MessageEvent<PosCustomerDisplayMessage>) =>
		{
			displayState.value = event.data;
		};

		return () =>
		{
			channel.close();
		};
	}, [terminalId]);

	const data = displayState.value;
	const isCheckoutComplete = data.type === "CHECKOUT_COMPLETED";
	const hasItems = data.items && data.items.length > 0;

	return (
		<div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden select-none"
		     dir="rtl">
			{/* Top Header with Store Branding */ }
			<header
				className="h-20 bg-card border-b border-border flex items-center justify-between px-8 shadow-sm shrink-0">
				<div className="flex items-center gap-4">
					{ setting?.logo.value?.url ? (
						<img src={ setting.logo.value.url } alt="Logo" className="w-12 h-12 object-contain"/>
					) : (
						<div
							className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
							<Store className="w-6 h-6"/>
						</div>
					) }
					<div>
						<h1 className="text-xl font-black text-primary">{ setting?.companyName.value || "نقطة البيع" }</h1>
						{ setting?.vatNumber.value && (
							<p className="text-xs text-muted-foreground">الرقم الضريبي: { setting.vatNumber.value }</p>
						) }
					</div>
				</div>

				<div className="text-left">
					<span className="text-xs text-muted-foreground block">أهلاً بك</span>
					<span className="text-sm font-bold text-foreground">Welcome</span>
				</div>
			</header>

			{/* Main Display Body */ }
			<main className="flex-1 flex overflow-hidden">
				{ isCheckoutComplete ? (
					/* 1. Thank You / Payment Success State */
					<div
						className="flex-1 flex flex-col items-center justify-center p-8 bg-primary/5 gap-6 animate-in zoom-in-95 duration-300">
						<div
							className="w-24 h-24 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
							<CheckCircle2 className="w-16 h-16"/>
						</div>
						<div className="text-center">
							<h2 className="text-3xl font-black text-foreground mb-2">تمت عملية الدفع بنجاح</h2>
							<p className="text-muted-foreground text-lg">شكراً لزيارتكم! نتطلع لرؤيتكم مرة أخرى</p>
						</div>

						{ data.tenderedAmount !== undefined && data.tenderedAmount > 0 && (
							<div
								className="grid grid-cols-2 gap-6 w-full max-w-lg bg-card p-6 rounded-2xl border border-border shadow-sm text-center mt-4">
								<div>
									<span className="text-sm text-muted-foreground block mb-1">المبلغ المدفوع</span>
									<span className="text-2xl font-bold">
										{ data.tenderedAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) }
										<ErpCurrencyIcon className="w-5 h-5 inline"/>
									</span>
								</div>
								<div>
									<span
										className="text-sm text-muted-foreground block mb-1">المبلغ المتبقي (Change)</span>
									<span className="text-2xl font-black text-green-600">
										{ (data.changeAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2}) }
										<ErpCurrencyIcon className="w-5 h-5 inline"/>
									</span>
								</div>
							</div>
						) }
					</div>
				) : !hasItems ? (
					/* 2. Idle / Welcome State */
					<div
						className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-4">
						<div className="w-28 h-28 rounded-full bg-muted/40 flex items-center justify-center mb-2">
							<ShoppingBag className="w-14 h-14 opacity-40 text-primary"/>
						</div>
						<h2 className="text-2xl font-bold text-foreground">مرحباً بك
							في { setting?.companyName.value }</h2>
						<p className="text-base max-w-md">يرجى تقديم المنتجات للكاشير للبدء في تجهيز الفاتورة</p>
					</div>
				) : (
					/* 3. Live Cart Display */
					<>
						{/* Left: Cart Items List */ }
						<div className="flex-1 flex flex-col border-l border-border bg-card/50">
							<div
								className="p-4 border-b border-border bg-muted/20 font-bold text-sm text-muted-foreground grid grid-cols-12">
								<span className="col-span-6">المنتج</span>
								<span className="col-span-2 text-center">الكمية</span>
								<span className="col-span-2 text-center">السعر</span>
								<span className="col-span-2 text-left">الإجمالي</span>
							</div>

							<div className="flex-1 overflow-y-auto p-4 space-y-3">
								{ data.items?.map((item, idx) => (
									<div
										key={ idx }
										className="grid grid-cols-12 items-center p-4 bg-card rounded-xl border border-border/80 shadow-xs text-base"
									>
										<div className="col-span-6 flex flex-col">
											<span className="font-bold text-foreground">{ item.name }</span>
											{ item.unitName && <span
                                                className="text-xs text-muted-foreground">{ item.unitName }</span> }
										</div>
										<span
											className="col-span-2 text-center font-bold text-lg">x{ item.quantity }</span>
										<span className="col-span-2 text-center text-muted-foreground">
											{ item.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2}) }
										</span>
										<span className="col-span-2 text-left font-black text-primary text-lg">
											{ item.totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2}) }{ " " }
											<ErpCurrencyIcon className="w-4 h-4 inline"/>
										</span>
									</div>
								)) }
							</div>
						</div>

						{/* Right: Big Totals Panel */ }
						<div className="w-[420px] bg-card flex flex-col justify-between p-8 shrink-0 shadow-lg">
							<div className="space-y-6">
								<h3 className="text-xl font-bold border-b border-border pb-4">ملخص الفاتورة</h3>

								<div className="space-y-3 text-lg">
									<div className="flex justify-between text-muted-foreground">
										<span>عدد الأصناف:</span>
										<span className="font-bold text-foreground">{ data.items?.length || 0 }</span>
									</div>

									{ data.discount !== undefined && data.discount !== 0 && (
										<div className="flex justify-between text-muted-foreground">
											<span>الخصم / التسوية:</span>
											<span className="font-bold text-red-600">
												{ data.discount.toLocaleString(undefined, {minimumFractionDigits: 2}) }{ " " }
												<ErpCurrencyIcon className="w-4 h-4 inline"/>
											</span>
										</div>
									) }

									<div className="flex justify-between text-muted-foreground">
										<span>الضريبة:</span>
										<span className="font-bold text-foreground">
											{ (data.totalTax || 0).toLocaleString(undefined, {minimumFractionDigits: 2}) }{ " " }
											<ErpCurrencyIcon className="w-4 h-4 inline"/>
										</span>
									</div>
								</div>
							</div>

							{/* Grand Total Box */ }
							<div
								className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center space-y-2">
								<span className="text-muted-foreground font-semibold text-base block">الإجمالي النهائي المطلوب</span>
								<span className="text-5xl font-black text-primary tracking-tight">
									{ (data.totalAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2}) }
									<ErpCurrencyIcon className="w-8 h-8 inline mr-2 text-primary"/>
								</span>
							</div>
						</div>
					</>
				) }
			</main>
		</div>
	);
}