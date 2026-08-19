import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch, SystemPermissionsActions } from "yusr-ui";
import { FiscalPeriodDto, FiscalPeriodStatus, FiscalYearDto, FiscalYearStatus } from "@/core/data/fiscalYear";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";


interface FiscalPeriodsListProps
{
	year: FiscalYearDto;
}

export function FiscalPeriodsList({year}: FiscalPeriodsListProps)
{
	const [periods, setPeriods] = useState<FiscalPeriodDto[]>(year.periods || []);
	const [updatingPeriodId, setUpdatingPeriodId] = useState<number | null>(null);

	const isYearClosed = year.status === FiscalYearStatus.Closed;
	const canUpdatePeriods = Services.auth.hasAuth(
		SystemPermissionsResources.FiscalPeriods,
		SystemPermissionsActions.Update
	);

	const handlePeriodStatusChange = async (period: FiscalPeriodDto, newStatus: FiscalPeriodStatus) =>
	{
		if (isYearClosed || updatingPeriodId !== null) return;

		setUpdatingPeriodId(period.id);

		try
		{
			const res = await Services.fiscalYearsApi.UpdatePeriodStatus({
				periodId: period.id,
				status: newStatus,
				rowVer: period.rowVer
			});

			if (res.status === 200)
			{
				toast.success(`تم ${ newStatus === FiscalPeriodStatus.Open ? "فتح" : "إغلاق" } فترة ${ period.name }`);

				// 1. Update local state
				const updatedPeriods = periods.map((p) =>
					p.id === period.id ? {...p, status: newStatus} : p
				);
				setPeriods(updatedPeriods);
				year.periods = updatedPeriods;

				// 2. Update global Cubits state
				Cubits.fiscalYears.entities.value = Cubits.fiscalYears.entities.value.map((y) =>
				{
					if (y.id === year.id)
					{
						return {...y, periods: updatedPeriods};
					}
					return y;
				});
			}
			else
			{
				toast.error("فشل في تحديث حالة الفترة المالية");
			}
		}
		catch
		{
			toast.error("حدث خطأ غير متوقع أثناء تحديث حالة الفترة المالية");
		}
		finally
		{
			setUpdatingPeriodId(null);
		}
	};

	return (
		<div className="space-y-3">
			<p className="text-xs text-muted-foreground">
				التحكم بحالة الفترات الشهرية (فتح / تجميد):
			</p>

			{/* 4 صفوف × 3 فترات في كل صف */ }
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
				{ periods.map((period) =>
				{
					const isPeriodOpen = period.status === FiscalPeriodStatus.Open;
					const isUpdating = updatingPeriodId === period.id;

					return (
						<div
							key={ period.id }
							className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card shadow-2xs"
						>
							<div className="flex flex-col gap-0.5">
								<span className="font-bold text-xs">{ period.name }</span>
								<span className="text-[10px] text-muted-foreground">
									{ period.startDate } إلى { period.endDate }
								</span>
							</div>

							<div className="flex items-center gap-2">
								{ isUpdating ? (
									<Loader2 className="w-3.5 h-3.5 animate-spin text-primary"/>
								) : (
									<span
										className={ `text-[10px] font-semibold px-2 py-0.5 rounded-full ${
											isPeriodOpen
												? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
												: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
										}` }
									>
										{ isPeriodOpen ? "مفتوحة" : "مجمّدة" }
									</span>
								) }

								{ canUpdatePeriods && (
									<Switch
										checked={ isPeriodOpen }
										disabled={ isYearClosed || isUpdating }
										onCheckedChange={ (checked) =>
											handlePeriodStatusChange(
												period,
												checked ? FiscalPeriodStatus.Open : FiscalPeriodStatus.Locked
											)
										}
									/>
								) }
							</div>
						</div>
					);
				}) }
			</div>
		</div>
	);
}