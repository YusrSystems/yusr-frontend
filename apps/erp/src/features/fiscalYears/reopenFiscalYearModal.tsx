import { useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "yusr-ui";
import { FiscalYearDto, ReopenFiscalYearDto } from "@/core/data/fiscalYear.ts";
import { fiscalYearsApi } from "./fiscalYears.api";


interface ReopenFiscalYearModalProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	fiscalYear: FiscalYearDto;
	onSuccess: (updatedYear: FiscalYearDto) => void;
}

export default function ReopenFiscalYearModal({
	open,
	onOpenChange,
	fiscalYear,
	onSuccess
}: ReopenFiscalYearModalProps)
{
	useSignals();

	const isReopening = useMemo(() => signal(false), []);

	const handleConfirmReopen = async () =>
	{
		if (isReopening.value) return;

		isReopening.value = true;
		const dto: ReopenFiscalYearDto = {
			fiscalYearId: fiscalYear.id,
			rowVer: fiscalYear.rowVer
		};

		try
		{
			const res = await fiscalYearsApi.reopenYear(dto);
			if (res.ok && res.data)
			{
				toast.success(`تم إعادة فتح السنة المالية ${ fiscalYear.name } بنجاح`);
				onSuccess(res.data);
				onOpenChange(false);
			}
		}
		finally
		{
			isReopening.value = false;
		}
	};

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogContent dir="rtl" className="sm:max-w-md max-h-[94dvh] flex flex-col overflow-hidden">
				<DialogHeader className="shrink-0">
					<DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
						<RotateCcw className="w-5 h-5 text-amber-600 shrink-0"/>
						<span>إعادة فتح السنة المالية ({ fiscalYear.name })</span>
					</DialogTitle>
					<DialogDescription className="pt-2 text-start leading-relaxed text-xs sm:text-sm">
						هل أنت متأكد من أنك تريد إعادة فتح السنة المالية <strong>{ fiscalYear.name }</strong>؟
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 min-h-0 overflow-y-auto py-2 px-1">
					<div
						className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 sm:p-4 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
						<AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5"/>
						<span>
							سيؤدي هذا الإجراء إلى عكس قيد الإقفال السنوي واستعادة أرصدة الحسابات الاسمية (الإيرادات والمصروفات).
						</span>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0 shrink-0">
					<Button variant="outline" onClick={ () => onOpenChange(false) } disabled={ isReopening.value }>
						إلغاء
					</Button>
					<Button
						className="bg-amber-600 hover:bg-amber-700 text-white"
						onClick={ handleConfirmReopen }
						disabled={ isReopening.value }
					>
						{ isReopening.value ? <Loader2 className="w-4 h-4 animate-spin ml-2"/> : null }
						تأكيد إعادة الفتح
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}