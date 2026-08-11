import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { useEffect, useMemo } from "react";
import { Button, cn, Dialog, DialogContent, DialogHeader, DialogTitle, TextAreaField } from "yusr-ui";
import Invoice from "@/core/data/invoices/invoice";
import { PosTerminalDto } from "@/core/data/posTerminal";
import { PosCheckoutDto, PosPaymentLineDto, PosSessionDto } from "@/core/data/posSession";
import { Services } from "@/core/services/services";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import {
	ArrowRightLeft,
	Banknote,
	CheckCircle2,
	CircleDollarSign,
	Clock,
	CreditCard,
	Gift,
	Loader2,
	Plus,
	Receipt,
	Trash2,
	User,
	Wallet
} from "lucide-react";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";
import { toast } from "sonner";


interface PosCheckoutDialogProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	invoice: Invoice;
	terminal: PosTerminalDto;
	session: PosSessionDto;
	onSuccess: () => void;
}

const getPaymentIcon = (category: number) =>
{
	switch (category)
	{
		case 1:
			return <Banknote className="w-5 h-5"/>;
		case 2:
			return <CreditCard className="w-5 h-5"/>;
		case 3:
			return <ArrowRightLeft className="w-5 h-5"/>;
		case 4:
			return <Wallet className="w-5 h-5"/>;
		case 5:
			return <User className="w-5 h-5"/>;
		case 6:
			return <Clock className="w-5 h-5"/>;
		case 7:
			return <Gift className="w-5 h-5"/>;
		case 8:
			return <Receipt className="w-5 h-5"/>;
		default:
			return <CircleDollarSign className="w-5 h-5"/>;
	}
};

export default function PosCheckoutDialog({
	open,
	onOpenChange,
	invoice,
	terminal,
	session,
	onSuccess
}: PosCheckoutDialogProps)
{
	useSignals();

	const isSubmitting = useMemo(() => signal(false), []);
	const payments = useMemo(() => signal<PosPaymentLineDto[]>([]), []);
	const notes = useMemo(() => signal(""), []);

	const totalAmount = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(invoice.invoiceItems.value);

	const totalPaid = payments.value.reduce((sum, p) => sum + (p.amount || 0), 0);
	const remaining = Number((totalAmount - totalPaid).toFixed(2));
	const change = remaining < 0 ? Math.abs(remaining) : 0;

	useEffect(() =>
	{
		if (open)
		{
			isSubmitting.value = false;
			notes.value = "";

			const firstMethod = terminal.allowedPaymentMethods?.[0];
			if (firstMethod && firstMethod.id !== undefined)
			{
				const initialPayment: PosPaymentLineDto = {
					paymentMethodId: firstMethod.id,
					amount: totalAmount,
					referenceNumber: ""
				};
				payments.value = [initialPayment];
			}
			else
			{
				payments.value = [];
			}
		}
	}, [open, totalAmount, terminal.allowedPaymentMethods, isSubmitting, notes, payments]);

	const handleAddPayment = () =>
	{
		const firstMethod = terminal.allowedPaymentMethods?.[0];
		if (firstMethod && firstMethod.id !== undefined)
		{
			const newPayment: PosPaymentLineDto = {
				paymentMethodId: firstMethod.id,
				amount: remaining > 0 ? remaining : 0,
				referenceNumber: ""
			};
			payments.value = [...payments.value, newPayment];
		}
		else
		{
			toast.error("لا توجد طرق دفع متاحة لهذه النقطة");
		}
	};

	const handleRemovePayment = (index: number) =>
	{
		payments.value = payments.value.filter((_, i) => i !== index);
	};

	const handleUpdatePayment = <K extends keyof PosPaymentLineDto>(index: number, field: K, value: PosPaymentLineDto[K]) =>
	{
		const newPayments = [...payments.value];
		newPayments[index] = {...newPayments[index], [field]: value};
		payments.value = newPayments;
	};

	const handleCheckout = async () =>
	{
		// 1. Strict Validations
		if (!invoice.partnerId.value)
		{
			toast.error("الرجاء اختيار العميل من السلة أولاً");
			return;
		}

		if (invoice.invoiceItems.value.length === 0)
		{
			toast.error("السلة فارغة");
			return;
		}

		if (remaining > 0)
		{
			toast.error("المبلغ المدفوع غير كافٍ");
			return;
		}

		isSubmitting.value = true;

		// 2. Handle Change (Deduct from Cash)
		const finalPayments = payments.value.map(p => ({...p}));
		if (change > 0)
		{
			const cashMethod = terminal.allowedPaymentMethods?.find(m => m.category === 1);
			if (cashMethod && cashMethod.id !== undefined)
			{
				const cashLine = finalPayments.find(p => p.paymentMethodId === cashMethod.id);
				if (cashLine)
				{
					cashLine.amount = Number((cashLine.amount - change).toFixed(2));
				}
			}
		}

		// 3. Format Items (Ensure index is set and no undefined values)
		const formattedItems = invoice.invoiceItems.value.map((item, index) =>
		{
			const itemDto = item.toJson();
			itemDto.index = index;
			return itemDto;
		});

		// 4. Build Payload
		const dto: PosCheckoutDto = {
			posSessionId: session.id,
			invoiceType: invoice.type.value,
			partnerId: invoice.partnerId.value,
			fullAmount: totalAmount || 0,
			settlementAmount: invoice.settlementAmount.value || 0,
			notes: notes.value || undefined,
			idempotencyKey: crypto.randomUUID(),
			items: formattedItems,
			payments: finalPayments.filter(p => p.amount > 0)
		};

		try
		{
			const res = await Services.posCheckoutApi.Checkout(dto);
			if (res.status === 200 && res.data)
			{
				toast.success("تمت عملية الدفع بنجاح");
				onSuccess();
			}
			else
			{
				// If it still fails, this will catch non-200 responses
				toast.error("حدث خطأ أثناء الدفع، يرجى التحقق من البيانات");
			}
		}
		catch (error)
		{
			toast.error("فشل الاتصال بالخادم");
			console.error(error);
		}
		finally
		{
			isSubmitting.value = false;
		}
	};

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogContent dir="rtl" className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl">إتمام الدفع</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
					{/* Left Side: Payment Methods */ }
					<div className="flex flex-col gap-4 border-l border-border pl-6">
						<div className="flex items-center justify-between">
							<h3 className="font-bold text-lg">طرق الدفع</h3>
							<Button variant="outline" size="sm" onClick={ handleAddPayment }>
								<Plus className="w-4 h-4 ml-1"/> إضافة
							</Button>
						</div>

						<div className="flex flex-col gap-4 max-h-100 overflow-y-auto pr-2">
							{ payments.value.map((payment, index) =>
							{
								const method = terminal.allowedPaymentMethods?.find(m => m.id === payment.paymentMethodId);
								return (
									<div key={ index }
									     className="flex flex-col gap-3 bg-card p-4 rounded-xl border border-border shadow-sm relative overflow-hidden group">
										<div className="flex items-center gap-3">
											<div
												className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
												{ getPaymentIcon(method?.category || 0) }
											</div>
											<select
												className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
												value={ payment.paymentMethodId }
												onChange={ (e) => handleUpdatePayment(index, "paymentMethodId", Number(e.target.value)) }
											>
												{ terminal.allowedPaymentMethods?.map(pm => (
													<option key={ pm.id } value={ pm.id }>{ pm.name }</option>
												)) }
											</select>
											<Button
												variant="ghost"
												size="icon"
												className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
												onClick={ () => handleRemovePayment(index) }
											>
												<Trash2 className="w-4 h-4"/>
											</Button>
										</div>

										<div className="flex items-center gap-2">
											<div className="relative flex-1">
												<input
													type="number"
													min="0"
													step="0.01"
													className="w-full h-12 rounded-lg border-2 border-input bg-muted/20 px-4 text-lg font-bold text-left focus:outline-none focus:border-primary focus:bg-background transition-colors"
													value={ payment.amount === 0 ? "" : payment.amount }
													onChange={ (e) => handleUpdatePayment(index, "amount", parseFloat(e.target.value) || 0) }
													onFocus={ (e) => e.target.select() }
													placeholder="0.00"
												/>
												<div
													className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
													<ErpCurrencyIcon className="w-4 h-4"/>
												</div>
											</div>
											{ remaining > 0 && (
												<Button
													variant="secondary"
													className="h-12 px-4 font-bold text-primary bg-primary/10 hover:bg-primary/20"
													onClick={ () => handleUpdatePayment(index, "amount", Number((payment.amount + remaining).toFixed(2))) }
													title="إكمال المبلغ المتبقي"
												>
													+{ remaining.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}) }
												</Button>
											) }
										</div>
									</div>
								);
							}) }
						</div>

						<div className="pt-2">
							<TextAreaField
								label="ملاحظات الفاتورة"
								value={ notes }
								rows={ 2 }
							/>
						</div>
					</div>

					{/* Right Side: Summary */ }
					<div className="flex flex-col gap-6">
						<div
							className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center flex flex-col gap-2">
							<span className="text-muted-foreground font-medium">الإجمالي المطلوب</span>
							<span className="text-4xl font-bold text-primary">
								{ totalAmount.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}) } <ErpCurrencyIcon className="w-6 h-6 inline"/>
							</span>
						</div>

						<div className="flex flex-col gap-3 text-lg">
							<div
								className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
								<span className="text-muted-foreground font-medium">المدفوع</span>
								<span className="font-bold text-xl">{ totalPaid.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}) } <ErpCurrencyIcon
									className="w-4 h-4 inline text-muted-foreground"/></span>
							</div>

							{ remaining > 0 ? (
								<div
									className="flex justify-between items-center p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
									<span className="font-bold">المتبقي</span>
									<span className="font-black text-2xl">{ remaining.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) }
										<ErpCurrencyIcon className="w-5 h-5 inline"/></span>
								</div>
							) : (
								<div
									className="flex justify-between items-center p-4 bg-green-50 text-green-600 rounded-xl border border-green-100">
									<span className="font-bold">الباقي للعميل (Change)</span>
									<span className="font-black text-2xl">{ change.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) } <ErpCurrencyIcon
										className="w-5 h-5 inline"/></span>
								</div>
							) }
						</div>

						<Button
							size="lg"
							className={ cn(
								"w-full h-14 text-xl mt-auto shadow-lg transition-transform",
								remaining > 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
							) }
							disabled={ remaining > 0 || isSubmitting.value }
							onClick={ handleCheckout }
						>
							{ isSubmitting.value ? <Loader2 className="w-6 h-6 animate-spin"/> :
								<CheckCircle2 className="w-6 h-6 ml-2"/> }
							تأكيد الدفع
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}