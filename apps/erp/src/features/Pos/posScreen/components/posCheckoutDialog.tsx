import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { useEffect, useMemo } from "react";
import {
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	NumberInput,
	SelectInput,
	TextAreaField
} from "yusr-ui";
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
	Undo2,
	User,
	Wallet
} from "lucide-react";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";
import { toast } from "sonner";
import { InvoiceType } from "@/core/types/invoiceType";
import type { InvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";


interface PosCheckoutDialogProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	invoice: Invoice;
	terminal: PosTerminalDto;
	session: PosSessionDto;
	onSuccess: (reportResult: InvoiceReportResult) => void;
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

	const isReturnMode = invoice.type.value === InvoiceType.SellReturn;

	const totalAmount = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(invoice.invoiceItems.value);

	const totalPaid = payments.value.reduce((sum, p) => sum + (p.amount || 0), 0);
	const remaining = Number((totalAmount - totalPaid).toFixed(2));
	const change = remaining < 0 ? Math.abs(remaining) : 0;

	useEffect(() =>
	{
		if (open)
		{
			isSubmitting.value = false;
			notes.value = invoice.notes.value || "";

			// If in Return mode and invoice has pre-filled payment vouchers from original invoice
			if (isReturnMode && invoice.paymentVouchers.value.length > 0)
			{
				payments.value = invoice.paymentVouchers.value.map(v => ({
					paymentMethodId: v.paymentMethodId.value ?? terminal.allowedPaymentMethods?.[0]?.id ?? 1,
					amount: v.amount.value ?? totalAmount,
					referenceNumber: ""
				}));
			}
			else
			{
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
		}
	}, [open, totalAmount, terminal.allowedPaymentMethods, isSubmitting, notes, payments, isReturnMode]);

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
		const current = newPayments[index]!;

		if (field === "amount")
		{
			const method = terminal.allowedPaymentMethods?.find(m => m.id === current.paymentMethodId);
			const isCash = method?.category === 1;
			const allowOverpay = isCash && !isReturnMode;

			if (!allowOverpay)
			{
				const othersTotal = newPayments.reduce(
					(sum, p, i) => (i === index ? sum : sum + (p.amount || 0)),
					0
				);
				const maxAllowed = Math.max(0, Number((totalAmount - othersTotal).toFixed(2)));
				value = Math.min(value as number, maxAllowed) as PosPaymentLineDto[K];
			}
		}

		newPayments[index] = {...current, [field]: value};
		payments.value = newPayments;
	};

	const handleCheckout = async () =>
	{
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
			toast.error(isReturnMode ? "المبلغ المراد إرجاعه غير مكتمل" : "المبلغ المدفوع غير كافٍ");
			return;
		}

		isSubmitting.value = true;

		const formattedItems = invoice.invoiceItems.value.map((item, index) =>
		{
			const itemDto = item.toJson();
			itemDto.index = index;
			return itemDto;
		});

		const dto: PosCheckoutDto = {
			posSessionId: session.id,
			invoiceType: invoice.type.value,
			originalInvoiceId: invoice.originalInvoiceId.value || undefined,
			partnerId: invoice.partnerId.value,
			fullAmount: totalAmount || 0,
			settlementAmount: invoice.settlementAmount.value || 0,
			notes: notes.value || undefined,
			idempotencyKey: crypto.randomUUID(),
			items: formattedItems,
			payments: payments.value.filter(p => p.amount > 0)
		};

		try
		{
			const res = await Services.posCheckoutApi.Checkout(dto);
			if (res.status === 200 && res.data)
			{
				toast.success(isReturnMode ? "تمت عملية إرجاع المبلغ بنجاح" : "تمت عملية الدفع بنجاح");
				onSuccess(res.data);
			}
			else
			{
				toast.error("حدث خطأ أثناء العملية، يرجى التحقق من البيانات");
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
					<DialogTitle
						className={ cn("text-2xl flex items-center gap-2", isReturnMode && "text-red-600 dark:text-red-400") }>
						{ isReturnMode ? <Undo2 className="w-6 h-6"/> : null }
						{ isReturnMode ? `إرجاع المبلغ للفاتورة #${ invoice.originalInvoiceId.value }` : "إتمام الدفع" }
					</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
					{/* Left Side: Payment Methods */ }
					<div className="flex flex-col gap-4 border-l border-border pl-6">
						<div className="flex items-center justify-between">
							<h3 className="font-bold text-lg">{ isReturnMode ? "طريقة إرجاع المبلغ" : "طرق الدفع" }</h3>
							<Button variant="outline" size="sm" onClick={ handleAddPayment }>
								<Plus className="w-4 h-4 ml-1"/> إضافة
							</Button>
						</div>

						<div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
							{ payments.value.map((payment, index) =>
							{
								const method = terminal.allowedPaymentMethods?.find(m => m.id === payment.paymentMethodId);
								const isCash = method?.category === 1;
								const allowOverpay = isCash && !isReturnMode;
								const othersTotal = payments.value.reduce((sum, p, i) => (i === index ? sum : sum + (p.amount || 0)), 0);
								const lineMax = allowOverpay ? undefined : Math.max(0, Number((totalAmount - othersTotal).toFixed(2)));

								return (
									<div key={ index }
									     className="shrink-0 flex flex-col gap-3 bg-card p-4 rounded-xl border border-border shadow-sm relative overflow-hidden group">
										<div className="flex items-center gap-3">
											<div
												className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
												{ getPaymentIcon(method?.category || 0) }
											</div>
											<div className="flex-1">
												<SelectInput<number>
													value={ signal(payment.paymentMethodId) }
													onValueChange={ (val) => handleUpdatePayment(index, "paymentMethodId", val) }
													options={ terminal.allowedPaymentMethods?.map(pm => ({
														label: pm.name,
														value: pm.id
													})) || [] }
												/>
											</div>
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
											<div className="flex-1">
												<NumberInput
													min={ 0 }
													max={ lineMax }
													value={ signal(payment.amount === 0 ? undefined : payment.amount) }
													onChange={ (val) => handleUpdatePayment(index, "amount", val || 0) }
													className="h-12 text-lg font-bold text-left bg-muted/20 focus:bg-background transition-colors"
													currency={ <ErpCurrencyIcon className="w-4 h-4"/> }
													placeholder="0.00"
												/>
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
							className={ cn(
								"border rounded-xl p-6 text-center flex flex-col gap-2",
								isReturnMode ? "bg-red-500/10 border-red-500/20" : "bg-primary/5 border-primary/20"
							) }>
							<span className="text-muted-foreground font-medium">
								{ isReturnMode ? "إجمالي المبلغ المراد إرجاعه" : "الإجمالي المطلوب" }
							</span>
							<span
								className={ cn("text-4xl font-bold", isReturnMode ? "text-red-600 dark:text-red-400" : "text-primary") }>
								{ totalAmount.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}) } <ErpCurrencyIcon className="w-6 h-6 inline"/>
							</span>
						</div>

						<div className="flex flex-col gap-3 text-lg">
							<div
								className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
								<span
									className="text-muted-foreground font-medium">{ isReturnMode ? "المسترد" : "المدفوع" }</span>
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
								!isReturnMode && (
									<div
										className="flex justify-between items-center p-4 bg-green-50 text-green-600 rounded-xl border border-green-100">
										<span className="font-bold">الباقي للعميل (Change)</span>
										<span className="font-black text-2xl">{ change.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										}) } <ErpCurrencyIcon
											className="w-5 h-5 inline"/></span>
									</div>
								)
							) }
						</div>

						<Button
							size="lg"
							variant={ isReturnMode ? "destructive" : "default" }
							className={ cn(
								"w-full h-14 text-xl mt-auto shadow-lg transition-transform gap-2",
								remaining > 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
							) }
							disabled={ remaining > 0 || isSubmitting.value }
							onClick={ handleCheckout }
						>
							{ isSubmitting.value ? (
								<Loader2 className="w-6 h-6 animate-spin"/>
							) : isReturnMode ? (
								<Undo2 className="w-6 h-6"/>
							) : (
								<CheckCircle2 className="w-6 h-6"/>
							) }
							{ isReturnMode ? "تأكيد إرجاع المبلغ" : "تأكيد الدفع" }
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}