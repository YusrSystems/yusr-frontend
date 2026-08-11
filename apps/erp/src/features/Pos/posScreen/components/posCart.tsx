import { useSignals } from "@preact/signals-react/runtime";
import Invoice from "@/core/data/invoices/invoice";
import { Button } from "yusr-ui";
// Need to import ShoppingCart for the empty state
import { Minus, Plus, ShoppingCart, Trash2, User } from "lucide-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import { PartnerType } from "@/core/data/partner";


interface PosCartProps
{
	invoice: Invoice;
	onCheckout: () => void;
}

export default function PosCart({invoice, onCheckout}: PosCartProps)
{
	useSignals();

	const items = invoice.invoiceItems.value;

	const taxExclusive = InvoiceItemsMath.CalcInvoiceTaxExclusivePrice(items);
	const taxInclusive = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(items);
	const taxAmount = taxInclusive - taxExclusive;

	return (
		<div className="flex flex-col h-full">
			{/* Customer Selection */ }
			<div className="p-4 border-b border-border shrink-0 bg-muted/10">
				<div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
					<User className="w-4 h-4"/>
					العميل
				</div>
				<PartnersSearchableSelect
					id={ invoice.partnerId }
					label={ invoice.partnerName }
					types={ [PartnerType.Customer] }
				/>
			</div>

			{/* Cart Items */ }
			<div className="flex-1 overflow-y-auto p-2 space-y-2">
				{ items.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
						<ShoppingCart className="w-16 h-16 mb-4"/>
						<p>السلة فارغة</p>
					</div>
				) : (
					items.map((item, index) => (
						<div key={ `${ item.itemId.value }-${ index }` }
						     className="flex flex-col p-3 bg-background border border-border rounded-lg shadow-sm">
							<div className="flex justify-between items-start mb-2">
								<div className="flex flex-col">
									<span className="font-semibold text-sm">{ item.itemName.value }</span>
									<span className="text-xs text-muted-foreground">{ item.unitName.value }</span>
								</div>
								<span className="font-bold text-primary flex items-center gap-1">
									{ item.taxInclusiveTotalPrice.value.toLocaleString() } <ErpCurrencyIcon
									className="w-3 h-3"/>
								</span>
							</div>

							<div className="flex items-center justify-between mt-2">
								<div className="flex items-center bg-muted rounded-md border border-border">
									<button
										className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-r-md transition-colors"
										onClick={ () => item.changeQuantity(item.quantity.value + 1) }
									>
										<Plus className="w-4 h-4"/>
									</button>
									<div className="w-10 text-center font-semibold text-sm">
										{ item.quantity.value }
									</div>
									<button
										className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-l-md transition-colors"
										onClick={ () =>
										{
											if (item.quantity.value > 1)
											{
												item.changeQuantity(item.quantity.value - 1);
											}
										} }
									>
										<Minus className="w-4 h-4"/>
									</button>
								</div>

								<button
									className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
									onClick={ () => invoice.removeItem(index) }
								>
									<Trash2 className="w-4 h-4"/>
								</button>
							</div>
						</div>
					))
				) }
			</div>

			{/* Totals & Checkout */ }
			<div className="p-4 bg-muted/20 border-t border-border shrink-0">
				<div className="space-y-2 mb-4 text-sm">
					<div className="flex justify-between text-muted-foreground">
						<span>المجموع (بدون ضريبة)</span>
						<span>{ taxExclusive.toLocaleString() } <ErpCurrencyIcon className="w-3 h-3 inline"/></span>
					</div>
					<div className="flex justify-between text-muted-foreground">
						<span>الضريبة</span>
						<span>{ taxAmount.toLocaleString() } <ErpCurrencyIcon className="w-3 h-3 inline"/></span>
					</div>
					<div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
						<span>الإجمالي المطلوب</span>
						<span className="text-primary">{ taxInclusive.toLocaleString() } <ErpCurrencyIcon
							className="w-4 h-4 inline"/></span>
					</div>
				</div>

				<Button
					size="lg"
					className="w-full h-14 text-lg font-bold"
					disabled={ items.length === 0 }
					onClick={ onCheckout }
				>
					الدفع
				</Button>
			</div>
		</div>
	);
}

