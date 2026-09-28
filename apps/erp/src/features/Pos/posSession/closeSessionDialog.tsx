import { PosSessionDto } from "@/core/data/posSession";
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
import { AlertTriangle, Calculator, Loader2, ReceiptText } from "lucide-react";
import { PosTempCache } from "@/features/Pos/posTempCache.ts";
import { posSessionsApi } from "./posSessions.api";


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

	const isLoading = useMemo(() => signal(false), []);
	const liveSession = useMemo(() => signal<PosSessionDto>(session), [session]);

	useEffect(() =>
	{
		if (open)
		{
			closingCash.value = 0;
			closingNotes.value = "";
			isSubmitting.value = false;
			isLoading.value = true;

			posSessionsApi.get(session.id)
				.then(res =>
				{
					if (res.ok && res.data)
					{
						liveSession.value = res.data;
					}
				})
				.finally(() =>
				{
					isLoading.value = false;
				});
		}
	}, [open, session.id]);

	const expectedCash = liveSession.value.expectedCash || 0;
	const difference = closingCash.value - expectedCash;

	const handleCloseSession = async () =>
	{
		isSubmitting.value = true;
		try
		{
			const res = await posSessionsApi.closeSession({
				posSessionId: liveSession.value.id,
				closingCash: closingCash.value,
				closingNotes: closingNotes.value,
				rowVer: liveSession.value.rowVer
			});

			if (res.ok && res.data)
			{
				PosTempCache.clear();
				onSuccess(res.data);
				onOpenChange(false);
			}
		}
		finally
		{
			isSubmitting.value = false;
		}
	};

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogContent dir="rtl" className="sm:max-w-xl max-h-[94dvh] flex flex-col overflow-hidden">
				<DialogHeader className="shrink-0">
					<DialogTitle className="flex items-center gap-2">
						<Calculator className="w-5 h-5 text-primary"/>
						<span>إغلاق الوردية</span>
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 sm:gap-6 py-2 px-1 relative">
					{ isLoading.value && (
						<div
							className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 rounded-xl">
							<Loader2 className="w-8 h-8 animate-spin text-primary"/>
						</div>
					) }

					<div className="bg-muted/30 border border-border rounded-xl p-3 sm:p-4 space-y-3">
						<div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-2">
							<ReceiptText className="w-4 h-4"/>
							ملخص الوردية
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
							<div className="flex flex-col gap-0.5">
								<span className="text-xs text-muted-foreground">إجمالي المبيعات</span>
								<span className="font-semibold text-emerald-600 text-sm sm:text-base">
									{ liveSession.value.totalSales?.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) }
									<ErpCurrencyIcon className="w-3 h-3 inline mr-1"/>
								</span>
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-xs text-muted-foreground">إجمالي المرتجعات</span>
								<span className="font-semibold text-red-600 text-sm sm:text-base">
									{ liveSession.value.totalSalesReturns?.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) }
									<ErpCurrencyIcon className="w-3 h-3 inline mr-1"/>
								</span>
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-xs text-muted-foreground">صافي المبيعات</span>
								<span className="font-bold text-primary text-sm sm:text-base">
									{ liveSession.value.totalNetSales?.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) }
									<ErpCurrencyIcon className="w-3 h-3 inline mr-1"/>
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						<div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/50 border border-border">
							<span className="text-xs sm:text-sm font-medium text-muted-foreground">المبلغ المتوقع في الصندوق</span>
							<span className="text-xl sm:text-2xl font-bold tabular-nums">
								{ expectedCash.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}) } <ErpCurrencyIcon className="w-4 h-4 inline text-muted-foreground"/>
							</span>
						</div>

						<div className="flex flex-col gap-1.5">
							<NumberField
								label="المبلغ الفعلي (الكاش)"
								value={ closingCash }
								min={ 0 }
								required
								currency={ <ErpCurrencyIcon/> }
								className="text-base sm:text-lg"
							/>
						</div>
					</div>

					<div className={ cn(
						"flex flex-wrap sm:flex-nowrap items-center justify-between p-3 sm:p-4 rounded-xl border gap-2",
						difference === 0 ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900" :
							difference > 0 ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900" :
								"bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900"
					) }>
						<div className="flex items-center gap-2">
							{ difference !== 0 && (
								<AlertTriangle
									className={ cn("w-5 h-5", difference > 0 ? "text-blue-600" : "text-red-600") }/>
							) }
							<span className="font-semibold text-sm">العجز / الزيادة</span>
						</div>
						<span className={ cn(
							"text-lg sm:text-xl font-bold tabular-nums",
							difference === 0 ? "text-green-600" :
								difference > 0 ? "text-blue-600" : "text-red-600"
						) }>
							{ difference > 0 ? "+" : "" }{ difference.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}) } <ErpCurrencyIcon className="w-4 h-4 inline"/>
						</span>
					</div>

					<TextAreaField
						label="ملاحظات الإغلاق"
						value={ closingNotes }
						placeholder="أدخل أي ملاحظات حول العجز أو الزيادة..."
						rows={ 2 }
					/>
				</div>

				<DialogFooter className="gap-2 sm:gap-0 shrink-0">
					<Button
						variant="outline"
						onClick={ () => onOpenChange(false) }
						disabled={ isSubmitting.value || isLoading.value }
					>
						إلغاء
					</Button>
					<Button
						onClick={ handleCloseSession }
						disabled={ isSubmitting.value || isLoading.value || closingCash.value === undefined }
					>
						تأكيد الإغلاق
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}