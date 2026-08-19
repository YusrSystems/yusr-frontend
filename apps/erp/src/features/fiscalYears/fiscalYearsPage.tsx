import React, { useEffect, useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { Calendar, Lock, LockKeyhole, LockKeyholeOpen, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
	ChangeableEntityMode,
	ContextMenuItem,
	CrudPage,
	DropdownMenuItem,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { FiscalYearDto, FiscalYearStatus } from "@/core/data/fiscalYear.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import ChangeFiscalYearDialog from "./changeFiscalYearDialog.tsx";
import CloseFiscalYearModal from "./closeFiscalYearModal.tsx";
import ReopenFiscalYearModal from "./reopenFiscalYearModal.tsx";
import { FiscalYearStatusBadge } from "./components/fiscalYearStatusBadge.tsx";
import { APP_NAME } from "../../../appConfig.ts";


export default function FiscalYearsPage()
{
	useSignals();

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
				onToggleLockYear={ handleToggleLockYear }
				onOpenCloseModal={ (year) => (yearToClose.value = year) }
				onOpenReopenModal={ (year) => (yearToReopen.value = year) }
			/>

			{/* Standard CrudPage Change Dialog */ }
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

			{/* Standard CrudPage Delete Dialog */ }
			<CrudPage.DeleteDialog
				entityNameSelector={ (year) => year.name }
				service={ Services.fiscalYearsApi }
				onSuccess={ (year) => Cubits.fiscalYears.delete(year) }
			/>

			{/* Year-End Closing Modal */ }
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

			{/* Reopen Closed Year Modal */ }
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

interface PageTableProps
{
	onToggleLockYear: (year: FiscalYearDto) => void;
	onOpenCloseModal: (year: FiscalYearDto) => void;
	onOpenReopenModal: (year: FiscalYearDto) => void;
}

function PageTable({
	onToggleLockYear,
	onOpenCloseModal,
	onOpenReopenModal
}: PageTableProps)
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

	const getActions = (
		year: FiscalYearDto,
		_openEditDialog: (dto: FiscalYearDto) => void,
		ItemComponent: typeof DropdownMenuItem | typeof ContextMenuItem
	) =>
	{
		const items: React.ReactNode[] = [];
		const isClosed = year.status === FiscalYearStatus.Closed;
		const isLocked = year.status === FiscalYearStatus.Locked;

		const canUpdate = Services.auth.hasAuth(
			SystemPermissionsResources.FiscalYears,
			SystemPermissionsActions.Update
		);
		const canClose = Services.auth.hasAuth(
			SystemPermissionsResources.FiscalYearClose,
			SystemPermissionsActions.Get
		);
		const canReopen = Services.auth.hasAuth(
			SystemPermissionsResources.FiscalYearReopen,
			SystemPermissionsActions.Get
		);

		if (!isClosed && canUpdate)
		{
			items.push(
				<ItemComponent key="toggle-lock" onSelect={ () => onToggleLockYear(year) }>
					{ isLocked ? (
						<>
							<LockKeyholeOpen className="w-4 h-4 me-2 text-emerald-600"/>
							فك التجميد
						</>
					) : (
						<>
							<LockKeyhole className="w-4 h-4 me-2 text-amber-600"/>
							تجميد
						</>
					) }
				</ItemComponent>
			);
		}

		if (!isClosed && canClose)
		{
			items.push(
				<ItemComponent key="close-year" className="text-destructive font-semibold"
				               onSelect={ () => onOpenCloseModal(year) }>
					<Lock className="w-4 h-4 me-2"/>
					إقفال السنة
				</ItemComponent>
			);
		}

		if (isClosed && canReopen)
		{
			items.push(
				<ItemComponent key="reopen-year" className="text-amber-600 font-semibold"
				               onSelect={ () => onOpenReopenModal(year) }>
					<RotateCcw className="w-4 h-4 me-2"/>
					إعادة الفتح
				</ItemComponent>
			);
		}

		return items;
	};

	if (Cubits.fiscalYears.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<FiscalYearDto>
					isShareablePage={ true }
					data={ Cubits.fiscalYears.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: "رقم السنة", rowStyles: "w-24"},
						{rowBody: "اسم السنة المالية", rowStyles: "w-48"},
						{rowBody: "تاريخ البداية", rowStyles: "w-32"},
						{rowBody: "تاريخ النهاية", rowStyles: "w-32"},
						{rowBody: "الحالة", rowStyles: "w-32 text-center"}
					] }
					tableRowMapper={ (year) => [
						{rowBody: `#${ year.id }`, rowStyles: "font-mono"},
						{rowBody: year.name, rowStyles: "font-semibold text-foreground"},
						{rowBody: year.startDate, rowStyles: "text-muted-foreground"},
						{rowBody: year.endDate, rowStyles: "text-muted-foreground"},
						{
							rowBody: <FiscalYearStatusBadge status={ year.status }/>,
							rowStyles: "text-center"
						}
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.FiscalYears,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ (year) =>
						year.status !== FiscalYearStatus.Closed &&
						Services.auth.hasAuth(
							SystemPermissionsResources.FiscalYears,
							SystemPermissionsActions.Delete
						)
					}
					dropdownItems={ (year, openEditDialog) => getActions(year, openEditDialog, DropdownMenuItem) }
					contextMenuItems={ (year, openEditDialog) => getActions(year, openEditDialog, ContextMenuItem) }
				/>

				<CrudPage.TablePagination
					pageSize={ Cubits.fiscalYears.pageSize.value }
					totalNumber={ Cubits.fiscalYears.count.value }
					currentPage={ Cubits.fiscalYears.currentPage.value }
					onPageChanged={ (newPage) => Cubits.fiscalYears.changePage(newPage) }
				/>
			</CrudPage.Table>
		);
	}

	return <TablePreview.Empty/>;
}