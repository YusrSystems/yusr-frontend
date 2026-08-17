import { useEffect, useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { Calendar, ChevronDown, ChevronLeft, Lock, LockKeyhole, LockKeyholeOpen, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
	Button,
	ChangeableEntityMode,
	CrudPage,
	PageError,
	PageLoaded,
	PageLoading,
	Switch,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { FiscalPeriodDto, FiscalPeriodStatus, FiscalYearDto, FiscalYearStatus } from "@/core/data/fiscalYear.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import ChangeFiscalYearDialog from "./changeFiscalYearDialog.tsx";
import CloseFiscalYearModal from "./closeFiscalYearModal.tsx";
import ReopenFiscalYearModal from "./reopenFiscalYearModal.tsx";
import { APP_NAME } from "../../../appConfig.ts";


export default function FiscalYearsPage()
{
	useSignals();

	const expandedYearIds = useMemo(() => signal<number[]>([]), []);
	const yearToClose = useMemo(() => signal<FiscalYearDto | undefined>(undefined), []);
	const yearToReopen = useMemo(() => signal<FiscalYearDto | undefined>(undefined), []);

	useEffect(() =>
	{
		Cubits.fiscalYears.init();
	}, []);

	useEffect(() =>
	{
		document.title = `السنوات والفترات المالية | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.FiscalYears, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	const toggleExpandYear = (id: number) =>
	{
		if (expandedYearIds.value.includes(id))
		{
			expandedYearIds.value = expandedYearIds.value.filter((x) => x !== id);
		}
		else
		{
			expandedYearIds.value = [...expandedYearIds.value, id];
		}
	};

	const handleToggleLockYear = async (year: FiscalYearDto) =>
	{
		const newStatus = year.status === FiscalYearStatus.Open ? FiscalYearStatus.Locked : FiscalYearStatus.Open;
		const res = await Services.fiscalYearsApi.ToggleLock({
			fiscalYearId: year.id,
			status: newStatus,
			rowVer: year.rowVer
		});

		if (res.status === 200 && res.data)
		{
			toast.success(`تم ${ newStatus === FiscalYearStatus.Locked ? "تجميد" : "فك تجميد" } السنة المالية ${ year.name }`);
			Cubits.fiscalYears.update(res.data);
		}
		else
		{
			toast.error("فشل في تغيير حالة السنة المالية");
		}
	};

	const handlePeriodStatusChange = async (period: FiscalPeriodDto, year: FiscalYearDto, newStatus: FiscalPeriodStatus) =>
	{
		if (year.status === FiscalYearStatus.Closed) return;

		const res = await Services.fiscalYearsApi.UpdatePeriodStatus({
			periodId: period.id,
			status: newStatus,
			rowVer: period.rowVer
		});

		if (res.status === 200)
		{
			toast.success(`تم ${ newStatus === FiscalPeriodStatus.Locked ? "إغلاق" : "فتح" } فترة ${ period.name }`);
			// Refresh list to update state
			Cubits.fiscalYears.init();
		}
		else
		{
			toast.error("فشل في تحديث حالة الفترة المالية");
		}
	};

	return (
		<CrudPage<FiscalYearDto>>
			<CrudPage.Header
				title="السنوات والفترات المالية"
				addButtonTitle="إضافة سنة مالية"
				isAddButtonVisible={ Services.auth.hasAuth(
					SystemPermissionsResources.FiscalYears,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.fiscalYears.search(searchText) }/>

			<PageTable
				expandedYearIds={ expandedYearIds }
				onToggleExpandYear={ toggleExpandYear }
				onToggleLockYear={ handleToggleLockYear }
				onOpenCloseModal={ (year) => (yearToClose.value = year) }
				onOpenReopenModal={ (year) => (yearToReopen.value = year) }
				onPeriodStatusChange={ handlePeriodStatusChange }
			/>

			<CrudPage.ChangeDialog
				fetchEntity={ async (id: number) =>
				{
					const result = await Services.fiscalYearsApi.Get(id);
					return result.data;
				} }
				changeDialog={ (dto: FiscalYearDto | undefined, closeDialog) => (
					<ChangeFiscalYearDialog
						dto={ dto }
						service={ Services.fiscalYearsApi }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								Cubits.fiscalYears.add(data);
								closeDialog();
							}
							else if (mode === ChangeableEntityMode.Update)
							{
								Cubits.fiscalYears.update(data);
							}
							Cubits.fiscalYears.init();
						} }
					/>
				) }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (year) => year.name }
				service={ Services.fiscalYearsApi }
				onSuccess={ (entity) => Cubits.fiscalYears.delete(entity) }
			/>

			{ yearToClose.value && (
				<CloseFiscalYearModal
					open={ !!yearToClose.value }
					onOpenChange={ (open) =>
					{
						if (!open) yearToClose.value = undefined;
					} }
					fiscalYear={ yearToClose.value }
					onSuccess={ (updatedYear) =>
					{
						Cubits.fiscalYears.update(updatedYear);
						yearToClose.value = undefined;
					} }
				/>
			) }

			{ yearToReopen.value && (
				<ReopenFiscalYearModal
					open={ !!yearToReopen.value }
					onOpenChange={ (open) =>
					{
						if (!open) yearToReopen.value = undefined;
					} }
					fiscalYear={ yearToReopen.value }
					onSuccess={ (updatedYear) =>
					{
						Cubits.fiscalYears.update(updatedYear);
						yearToReopen.value = undefined;
					} }
				/>
			) }
		</CrudPage>
	);
}

function Cards()
{
	useSignals();
	return (
		<CrudPage.Cards
			cards={ [
				{
					title: "إجمالي السنوات المالية",
					data: Cubits.fiscalYears.count.value.toString(),
					icon: <Calendar className="h-4 w-4 text-muted-foreground"/>
				}
			] }
		/>
	);
}

function PageTable({
	expandedYearIds,
	onToggleExpandYear,
	onToggleLockYear,
	onOpenCloseModal,
	onOpenReopenModal,
	onPeriodStatusChange
}: {
	expandedYearIds: { value: number[] };
	onToggleExpandYear: (id: number) => void;
	onToggleLockYear: (year: FiscalYearDto) => void;
	onOpenCloseModal: (year: FiscalYearDto) => void;
	onOpenReopenModal: (year: FiscalYearDto) => void;
	onPeriodStatusChange: (period: FiscalPeriodDto, year: FiscalYearDto, newStatus: FiscalPeriodStatus) => void;
})
{
	useSignals();

	if (Cubits.fiscalYears.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.fiscalYears.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	if (Cubits.fiscalYears.state.value instanceof PageLoaded)
	{
		const years = Cubits.fiscalYears.entities.value;

		return (
			<div className="w-full border rounded-xl overflow-hidden bg-card shadow-sm">
				<table className="w-full text-sm text-right">
					<thead className="bg-muted text-muted-foreground font-semibold border-b">
					<tr>
						<th className="p-3 w-10 text-center"></th>
						<th className="p-3 text-start">اسم السنة المالية</th>
						<th className="p-3 text-start">الفترة الزمنية</th>
						<th className="p-3 text-center w-32">الحالة</th>
						<th className="p-3 text-end w-64">الإجراءات</th>
					</tr>
					</thead>
					<tbody className="divide-y">
					{ years.map((year) =>
					{
						const isExpanded = expandedYearIds.value.includes(year.id);
						const isClosed = year.status === FiscalYearStatus.Closed;
						const isLocked = year.status === FiscalYearStatus.Locked;

						return (
							<tr key={ year.id } className="group flex-col">
								<td colSpan={ 5 } className="p-0">
									<div
										className="flex items-center justify-between p-3 hover:bg-muted/20 transition-colors">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<button
												type="button"
												onClick={ () => onToggleExpandYear(year.id) }
												className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
											>
												{ isExpanded ? <ChevronDown className="w-4 h-4"/> :
													<ChevronLeft className="w-4 h-4"/> }
											</button>

											<span className="font-bold text-base text-foreground">{ year.name }</span>
										</div>

										<div className="text-start flex-1 min-w-0 text-muted-foreground text-sm">
											{ year.startDate } ⬅ { year.endDate }
										</div>

										<div className="w-32 text-center shrink-0">
											<StatusBadge status={ year.status }/>
										</div>

										<div className="w-64 text-end flex items-center justify-end gap-2 shrink-0">
											{ !isClosed &&
												Services.auth.hasAuth(
													SystemPermissionsResources.FiscalYears,
													SystemPermissionsActions.Update
												) && (
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="h-8 gap-1 text-xs"
														onClick={ () => onToggleLockYear(year) }
													>
														{ isLocked ? (
															<>
																<LockKeyholeOpen
																	className="w-3.5 h-3.5 text-emerald-600"/>
																فك التجميد
															</>
														) : (
															<>
																<LockKeyhole className="w-3.5 h-3.5 text-amber-600"/>
																تجميد
															</>
														) }
													</Button>
												) }

											{ !isClosed &&
												Services.auth.hasAuth(
													SystemPermissionsResources.FiscalYearClose,
													SystemPermissionsActions.Get
												) && (
													<Button
														type="button"
														variant="destructive"
														size="sm"
														className="h-8 gap-1 text-xs"
														onClick={ () => onOpenCloseModal(year) }
													>
														<Lock className="w-3.5 h-3.5"/>
														إقفال السنة
													</Button>
												) }

											{ isClosed &&
												Services.auth.hasAuth(
													SystemPermissionsResources.FiscalYearReopen,
													SystemPermissionsActions.Get
												) && (
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="h-8 gap-1 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
														onClick={ () => onOpenReopenModal(year) }
													>
														<RotateCcw className="w-3.5 h-3.5"/>
														إعادة الفتح
													</Button>
												) }
										</div>
									</div>

									{/* Periods Breakdown (Expanded Row) */ }
									{ isExpanded && (
										<div
											className="bg-muted/20 border-t border-border p-4 animate-in fade-in slide-in-from-top-1">
											<h4 className="font-bold text-xs text-muted-foreground mb-3 px-2">
												الفترات الشهرية لسنة { year.name }
											</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
												{ year.periods?.map((period) =>
												{
													const isPeriodLocked = period.status === FiscalPeriodStatus.Locked;

													return (
														<div
															key={ period.id }
															className="flex items-center justify-between p-3 rounded-lg border border-border bg-card shadow-2xs"
														>
															<div className="flex flex-col gap-0.5">
																<span
																	className="font-bold text-sm">{ period.name }</span>
																<span className="text-[11px] text-muted-foreground">
									{ period.startDate } إلى { period.endDate }
								</span>
															</div>

															<div className="flex items-center gap-2">
								<span
									className={ `text-[11px] font-semibold px-2 py-0.5 rounded-full ${
										isPeriodLocked
											? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
											: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
									}` }
								>
								{ isPeriodLocked ? "مجمّدة" : "مفتوحة" }
								</span>

																{ Services.auth.hasAuth(
																	SystemPermissionsResources.FiscalPeriods,
																	SystemPermissionsActions.Update
																) && (
																	<Switch
																		checked={ isPeriodLocked }
																		disabled={ isClosed }
																		onCheckedChange={ (checked) =>
																			onPeriodStatusChange(
																				period,
																				year,
																				checked ? FiscalPeriodStatus.Locked : FiscalPeriodStatus.Open
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
									) }
								</td>
							</tr>
						);
					}) }
					</tbody>
				</table>

				<CrudPage.TablePagination
					pageSize={ Cubits.fiscalYears.pageSize.value }
					totalNumber={ Cubits.fiscalYears.count.value }
					currentPage={ Cubits.fiscalYears.currentPage.value }
					onPageChanged={ (newPage) => Cubits.fiscalYears.changePage(newPage) }
				/>
			</div>
		);
	}

	return <TablePreview.Empty/>;
}

function StatusBadge({status}: { status: FiscalYearStatus })
{
	switch (status)
	{
		case FiscalYearStatus.Open:
			return (
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
					مفتوحة 🟢
        </span>
			);
		case FiscalYearStatus.Locked:
			return (
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
					مجمّدة 🟡
        </span>
			);
		case FiscalYearStatus.Closed:
			return (
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
					مقفلة 🔴
        </span>
			);
		default:
			return null;
	}
}