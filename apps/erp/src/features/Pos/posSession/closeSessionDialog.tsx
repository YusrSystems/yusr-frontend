import { PosSessionDto } from "@/core/data/posSession";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { useEffect, useMemo } from "react";
import {
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	NumberField,
	TextAreaField
} from "yusr-ui";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { AlertTriangle, Calculator, ReceiptText } from "lucide-react";


interface CloseSessionDialogProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	session: PosSessionDto;
	onSuccess: (closedSession: PosSessionDto) => void;
}

export default function CloseSessionDialog({open, onOpenChange, session, onSuccess}: CloseSessionDialogProps)
{
	useSignals();

	const closingCash = useMemo(() => signal<number>(0), []);
	const closingNotes = useMemo(() => signal<string>(""), []);
	const isSubmitting = useMemo(() => signal(false), []);

	useEffect(() =>
	{
		if (open)
		{
			closingCash.value = 0;
			closingNotes.value = "";
			isSubmitting.value = false;
		}
	}, [open]);

	const expectedCash = session.expectedCash || 0;
	const difference = closingCash.value - expectedCash;

	const handleCloseSession = async () =>
	{
		isSubmitting.value = true;

		const res = await Services.posSessionsApi.CloseSession({
			posSessionId: session.id,
			closingCash: closingCash.value,
			closingNotes: closingNotes.value,
			rowVer: session.rowVer
		});

		if (res.status === 200 && res.data)
		{
			onSuccess(res.data);
			onOpenChange(false);
		}
		isSubmitting.value = false;
	};

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogContent dir="rtl" className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calculator className="w-5 h-5 text-primary"/>
						إغلاق الوردية
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-6 py-4">
					<div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
						<div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-2">
							<ReceiptText className="w-4 h-4"/>
							ملخص الوردية
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">إجمالي المبيعات</span>
								<span
									className="font-semibold text-emerald-600">{ session.totalSales?.toLocaleString() }
									<ErpCurrencyIcon className="w-3 h-3 inline"/></span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">إجمالي المرتجعات</span>
								<span
									className="font-semibold text-red-600">{ session.totalSalesReturns?.toLocaleString() }
									<ErpCurrencyIcon className="w-3 h-3 inline"/></span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">صافي المبيعات</span>
								<span className="font-bold text-primary">{ session.totalNetSales?.toLocaleString() }
									<ErpCurrencyIcon className="w-3 h-3 inline"/></span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2 p-4 rounded-xl bg-muted/50 border border-border">
							<span className="text-sm font-medium text-muted-foreground">المبلغ المتوقع في الصندوق</span>
							<span className="text-2xl font-bold tabular-nums">
                                { expectedCash.toLocaleString() } <ErpCurrencyIcon
								className="w-5 h-5 inline text-muted-foreground"/>
                            </span>
						</div>

						<div className="flex flex-col gap-2">
							<NumberField
								label="المبلغ الفعلي (الكاش)"
								value={ closingCash }
								min={ 0 }
								required
								currency={ <ErpCurrencyIcon/> }
								className="text-lg"
							/>
						</div>
					</div>

					<div className={ cn(
						"flex items-center justify-between p-4 rounded-xl border",
						difference === 0 ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900" :
							difference > 0 ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900" :
								"bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900"
					) }>
						<div className="flex items-center gap-2">
							{ difference !== 0 && <AlertTriangle
                                className={ cn("w-5 h-5", difference > 0 ? "text-blue-600" : "text-red-600") }/> }
							<span className="font-semibold">
                                العجز / الزيادة
                            </span>
						</div>
						<span className={ cn(
							"text-xl font-bold tabular-nums",
							difference === 0 ? "text-green-600" :
								difference > 0 ? "text-blue-600" : "text-red-600"
						) }>
                            { difference > 0 ? "+" : "" }{ difference.toLocaleString() } <ErpCurrencyIcon
							className="w-4 h-4 inline"/>
                        </span>
					</div>

					<TextAreaField
						label="ملاحظات الإغلاق"
						value={ closingNotes }
						placeholder="أدخل أي ملاحظات حول العجز أو الزيادة..."
						rows={ 2 }
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={ () => onOpenChange(false) } disabled={ isSubmitting.value }>
						إلغاء
					</Button>
					<Button onClick={ handleCloseSession }
					        disabled={ isSubmitting.value || closingCash.value === undefined }>
						تأكيد الإغلاق
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}