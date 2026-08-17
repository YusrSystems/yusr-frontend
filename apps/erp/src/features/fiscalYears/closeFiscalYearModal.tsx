import { useEffect, useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { AlertTriangle, CheckCircle2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	TextAreaField
} from "yusr-ui";
import { CloseFiscalYearDto, FiscalYearDto, YearEndClosingPreviewDto } from "@/core/data/fiscalYear.ts";
import { Services } from "@/core/services/services.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


interface CloseFiscalYearModalProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	fiscalYear: FiscalYearDto;
	onSuccess: (updatedYear: FiscalYearDto) => void;
}

export default function CloseFiscalYearModal({
	open,
	onOpenChange,
	fiscalYear,
	onSuccess
}: CloseFiscalYearModalProps)
{
	useSignals();

	const isLoading = useMemo(() => signal(true), []);
	const isClosing = useMemo(() => signal(false), []);
	const diagnostics = useMemo(() => signal<YearEndClosingPreviewDto | undefined>(undefined), []);
	const closingNotes = useMemo(() => signal(""), []);

	useEffect(() =>
	{
		if (open && fiscalYear.id)
		{
			isLoading.value = true;
			diagnostics.value = undefined;
			closingNotes.value = "";

			Services.fiscalYearsApi
				.GetClosingDiagnostics(fiscalYear.id)
				.then((res) =>
				{
					if (res.status === 200 && res.data)
					{
						diagnostics.value = res.data;
					}
					else
					{
						toast.error("حدث خطأ أثناء فحص تشخيصات إقفال السنة المالية");
					}
				})
				.finally(() =>
				{
					isLoading.value = false;
				});
		}
	}, [open, fiscalYear.id]);

	const handleConfirmClose = async () =>
	{
		if (!diagnostics.value || !diagnostics.value.canClose || isClosing.value) return;

		isClosing.value = true;
		const dto: CloseFiscalYearDto = {
			fiscalYearId: fiscalYear.id,
			closingNotes: closingNotes.value || undefined,
			rowVer: fiscalYear.rowVer
		};

		try
		{
			const res = await Services.fiscalYearsApi.CloseYear(dto);
			if (res.status === 200 && res.data)
			{
				toast.success(`تم إقفال السنة المالية ${ fiscalYear.name } بنجاح`);
				onSuccess(res.data);
				onOpenChange(false);
			}
			else
			{
				toast.error("فشل في إقفال السنة المالية");
			}
		}
		catch
		{
			toast.error("حدث خطأ غير متوقع أثناء إقفال السنة المالية");
		}
		finally
		{
			isClosing.value = false;
		}
	};

	const diag = diagnostics.value;

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogContent dir="rtl" className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<Lock className="w-5 h-5 text-destructive"/>
						إقفال السنة المالية ({ fiscalYear.name })
					</DialogTitle>
					<DialogDescription>
						فحص تشخيصات إقفال السنة المالية وتحويل حسابات الإيرادات والمصروفات إلى حساب الأرباح والخسائر
						المبقاة.
					</DialogDescription>
				</DialogHeader>

				{ isLoading.value ? (
					<div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
						<Loader2 className="w-8 h-8 animate-spin text-primary"/>
						<span>جاري فحص وتدقيق بيانات السنة المالية...</span>
					</div>
				) : diag ? (
					<div className="space-y-5 py-2">
						{ !diag.canClose ? (
							<div
								className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive space-y-3">
								<div className="flex items-center gap-2 font-bold text-base">
									<AlertTriangle className="w-5 h-5 shrink-0"/>
									<span>لا يمكن إقفال السنة المالية بسبب الملاحظات التالية:</span>
								</div>
								<ul className="list-disc list-inside space-y-1 text-sm mr-2 text-foreground/90">
									{ diag.blockingIssues.map((issue, idx) => (
										<li key={ idx }>{ issue }</li>
									)) }
								</ul>
							</div>
						) : (
							<>
								<div
									className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
									<CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600 dark:text-emerald-400"/>
									<span className="text-sm font-semibold">
                    تم فحص تشخيصات السنة المالية بنجاح. لا توجد أي عوائق تمنع الإقفال.
                  </span>
								</div>

								<div className="bg-card border border-border rounded-xl p-4 space-y-3">
									<h4 className="font-bold text-sm text-foreground">الملخص المالي للسنة المالية</h4>
									<div className="grid grid-cols-3 gap-3 text-center">
										<div className="p-3 bg-muted/40 rounded-lg">
											<span
												className="text-xs text-muted-foreground block">إجمالي الإيرادات</span>
											<span
												className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                        { diag.totalRevenue.toLocaleString("en-US", {minimumFractionDigits: 2}) }
												<ErpCurrencyIcon className="w-3.5 h-3.5 inline mr-1"/>
                      </span>
										</div>

										<div className="p-3 bg-muted/40 rounded-lg">
											<span
												className="text-xs text-muted-foreground block">إجمالي المصروفات</span>
											<span className="font-bold text-base text-destructive">
                        { diag.totalExpense.toLocaleString("en-US", {minimumFractionDigits: 2}) }
												<ErpCurrencyIcon className="w-3.5 h-3.5 inline mr-1"/>
                      </span>
										</div>

										<div className="p-3 bg-muted/40 rounded-lg">
                      <span className="text-xs text-muted-foreground block">
                        { diag.isProfit ? "صافي الربح" : "صافي الخسارة" }
                      </span>
											<span
												className={ `font-bold text-base ${
													diag.isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
												}` }
											>
                        { diag.netIncome.toLocaleString("en-US", {minimumFractionDigits: 2}) }
												<ErpCurrencyIcon className="w-3.5 h-3.5 inline mr-1"/>
                      </span>
										</div>
									</div>

									<p className="text-xs text-muted-foreground mt-2">
										* سيتم إنشاء قيد إقفال تلقائي لنقل
										صافي { diag.isProfit ? "الأرباح" : "الخسائر" } إلى حساب الأرباح
										والخسائر المبقاة المحسوب في إعدادات النظام.
									</p>
								</div>

								<TextAreaField label="ملاحظات الإقفال (اختياري)" value={ closingNotes } rows={ 3 }/>
							</>
						) }
					</div>
				) : null }

				<DialogFooter>
					<Button variant="outline" onClick={ () => onOpenChange(false) } disabled={ isClosing.value }>
						إلغاء
					</Button>
					<Button
						variant="destructive"
						onClick={ handleConfirmClose }
						disabled={ isLoading.value || !diag || !diag.canClose || isClosing.value }
					>
						{ isClosing.value ? <Loader2 className="w-4 h-4 animate-spin ml-2"/> : null }
						تأكيد وإقفال السنة المالية
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}