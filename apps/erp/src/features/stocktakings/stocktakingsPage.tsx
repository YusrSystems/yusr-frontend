import type { StocktakingDto } from "@/core/data/stocktaking";
import Stocktaking from "@/core/data/stocktaking";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowRightLeft, ClipboardCheck, Loader2, Printer } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
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
import ChangeStocktakingDialog from "./changeStocktakingDialog";
import { createPortal } from "react-dom";
import { StocktakingReport } from "@/features/reports/stocktaking/stocktakingReport.tsx";
import { signal } from "@preact/signals-react";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { APP_NAME } from "../../../appConfig.ts";
import { stocktakingsApi } from "./stocktakings.api";
import { toast } from "sonner";
import { itemsSettlementsApi } from "@/features/stocktakings/itemSettlements.api.ts";


export default function StocktakingsPage()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	useEffect(() =>
	{
		if (Services.auth.hasAuth(SystemPermissionsResources.Stocktakings, SystemPermissionsActions.Get))
		{
			void Cubits.stocktaking.init();
		}
	}, []);

	const printedStocktaking = useMemo(() => signal<StocktakingDto | undefined>(undefined), []);
	const convertingId = useMemo(() => signal<number | undefined>(undefined), []);

	useEffect(() =>
	{
		document.title = `${ t("stocktakings.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Stocktakings, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	const handleConvertToSettlement = async (stocktaking: StocktakingDto) =>
	{
		if (convertingId.value !== undefined) return;
		convertingId.value = stocktaking.id;

		const process = async () =>
		{
			const res = await itemsSettlementsApi.addFromStocktaking(stocktaking.id, stocktaking.description);
			if (res.ok && res.data)
			{
				void Cubits.itemsSettlements.init();
				return "تم إنشاء تسوية مواد من هذا الجرد بنجاح";
			}
			throw new Error(res.errors?.[0] || "فشل إنشاء تسوية المواد");
		};

		try
		{
			toast.promise(process(), {
				loading: `جاري تحويل الجرد #${ stocktaking.id } إلى تسوية مواد...`,
				success: (msg) => msg,
				error: (err) => err?.message || "حدث خطأ أثناء تحويل الجرد"
			});
		}
		finally
		{
			convertingId.value = undefined;
		}
	};

	return (
		<>
			<CrudPage<StocktakingDto>>
				<CrudPage.Header
					title={ t("stocktakings.title") }
					addButtonTitle={ t("stocktakings.addNewTitle") }
					isAddButtonVisible={ Services.auth.hasAuth(
						SystemPermissionsResources.Stocktakings,
						SystemPermissionsActions.Add
					) }
				/>
				<Cards/>
				<CrudPage.SearchInput onSearch={ (searchText) => Cubits.stocktaking.search(searchText) }/>
				<PageTable
					convertingId={ convertingId.value }
					onPrint={ (stocktaking) =>
					{
						printedStocktaking.value = stocktaking;
						const handleAfterPrint = () =>
						{
							printedStocktaking.value = undefined;
							window.removeEventListener("afterprint", handleAfterPrint);
						};
						window.addEventListener("afterprint", handleAfterPrint);
						requestAnimationFrame(() =>
						{
							requestAnimationFrame(() =>
							{
								window.print();
							});
						});
					} }
					onConvertToSettlement={ handleConvertToSettlement }
				/>
				<CrudPage.ChangeDialog
					fetchEntity={ async (id: number) =>
					{
						const result = await stocktakingsApi.get(id);
						return result.data;
					} }
					changeDialog={ (dto: StocktakingDto | undefined, closeDialog) => (
						<ChangeStocktakingDialog<Stocktaking, StocktakingDto>
							addDialogTitle={ t("stocktakings.addNewTitle") }
							updateDialogTitle={ `${ t("common:crudRow.edit") } ${ t("stocktakings.entityName") }` }
							dto={ dto }
							resource={ stocktakingsApi }
							hasWorkflow={ false }
							createEntity={ (d) => (d ? Stocktaking.load(d) : Stocktaking.create()) }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.stocktaking.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									Cubits.stocktaking.update(data);
								}
							} }
						/>
					) }
				/>
				<CrudPage.DeleteDialog<StocktakingDto>
					entityNameSelector={ () => `"${ t("stocktakings.entityName") }"` }
					resource={ stocktakingsApi }
					onSuccess={ (entity) => Cubits.stocktaking.delete(entity) }
				/>
			</CrudPage>
			{ createPortal(
				<PortalReportContainer>
					<StocktakingReport stocktaking={ printedStocktaking.value }/>
				</PortalReportContainer>,
				document.body
			) }
		</>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("stocking");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("stocktakings.totalStocktakings"),
				data: Cubits.stocktaking.count.value.toString(),
				icon: <ClipboardCheck className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable({
	convertingId,
	onPrint,
	onConvertToSettlement
}: {
	convertingId?: number;
	onPrint: (stocktaking: StocktakingDto) => void;
	onConvertToSettlement: (stocktaking: StocktakingDto) => void;
})
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (Cubits.stocktaking.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}
	if (Cubits.stocktaking.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	const getActions = (
		stocktaking: StocktakingDto,
		_openEditDialog: (dto: StocktakingDto) => void,
		ItemComponent: typeof DropdownMenuItem | typeof ContextMenuItem
	) => [
		<ItemComponent
			key="convert-settlement"
			className="text-primary font-semibold cursor-pointer"
			disabled={ convertingId === stocktaking.id }
			onSelect={ () => onConvertToSettlement(stocktaking) }
		>
			<ArrowRightLeft className="w-4 h-4 me-2"/>
			تحويل إلى تسوية مخزون
		</ItemComponent>
	];

	const canPrint = Services.auth.hasAuth(
		SystemPermissionsResources.ReportStocktaking,
		SystemPermissionsActions.Get
	);
	const canAddSettlement = Services.auth.hasAuth(
		SystemPermissionsResources.ItemsSettlements,
		SystemPermissionsActions.Add
	);

	if (Cubits.stocktaking.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<StocktakingDto>
					data={ Cubits.stocktaking.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("stocktakings.stocktakingId"), rowStyles: "w-32"},
						{rowBody: t("stocktakings.date"), rowStyles: "w-32"},
						{rowBody: t("stocktakings.store"), rowStyles: "w-48"},
						{rowBody: t("stocktakings.description"), rowStyles: ""},
						...((canPrint || canAddSettlement) ? [{rowBody: "", rowStyles: "w-44"}] : [])
					] }
					tableRowMapper={ (stocktaking) => [
						{rowBody: `#${ stocktaking.id }`, rowStyles: ""},
						{rowBody: stocktaking.date, rowStyles: ""},
						{rowBody: stocktaking.storeName, rowStyles: "font-semibold"},
						{rowBody: stocktaking.description ?? "-", rowStyles: "text-sm text-gray-500"},
						...((canPrint || canAddSettlement)
							? [{
								rowBody: (
									<div className="flex items-center justify-end gap-1.5">
										{ canAddSettlement && (
											<Button
												variant="outline"
												size="sm"
												className="h-8 gap-1.5 text-xs text-primary font-medium"
												disabled={ convertingId === stocktaking.id }
												onClick={ () => onConvertToSettlement(stocktaking) }
												title="تحويل هذا الجرد إلى تسوية مخزون"
											>
												{ convertingId === stocktaking.id ? (
													<Loader2 className="h-3.5 w-3.5 animate-spin"/>
												) : (
													<ArrowRightLeft className="h-3.5 w-3.5"/>
												) }
												<span>تسوية</span>
											</Button>
										) }
										{ canPrint && (
											<Button
												variant="outline"
												size="icon-sm"
												onClick={ () => onPrint(stocktaking) }
												title="طباعة تقرير الجرد"
											>
												<Printer className="h-4 w-4"/>
											</Button>
										) }
									</div>
								),
								rowStyles: "w-44"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Stocktakings,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Stocktakings,
						SystemPermissionsActions.Delete
					) }
					dropdownItems={ (stocktaking, openEditDialog) => getActions(stocktaking, openEditDialog, DropdownMenuItem) }
					contextMenuItems={ (stocktaking, openEditDialog) => getActions(stocktaking, openEditDialog, ContextMenuItem) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.stocktaking.pageSize.value }
					totalNumber={ Cubits.stocktaking.count.value }
					currentPage={ Cubits.stocktaking.currentPage.value }
					onPageChanged={ (newPage) => Cubits.stocktaking.changePage(newPage) }
				/>
			</CrudPage.Table>
		);
	}

	return <TablePreview.Empty/>;
}