import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { MonitorSmartphone } from "lucide-react";
import { useEffect } from "react";
import {
	ChangeableEntityMode,
	CrudPage,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { PosTerminalDto } from "@/core/data/posTerminal.ts";
import ChangePosTerminalDialog from "./changePosTerminalDialog";
import { APP_NAME } from "../../../../appConfig.ts";


export default function PosTerminalsPage()
{
	useSignals();

	useEffect(() => Cubits.posTerminals.init(), []);

	useEffect(() =>
	{
		document.title = `نقاط البيع | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<PosTerminalDto>>
			<CrudPage.Header
				title="أجهزة نقاط البيع"
				addButtonTitle="إضافة نقطة بيع"
				isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Add) }
			/>

			<CrudPage.Cards
				cards={ [{
					title: "إجمالي نقاط البيع",
					data: Cubits.posTerminals.count.value.toString(),
					icon: <MonitorSmartphone className="h-4 w-4 text-muted-foreground"/>
				}] }
			/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.posTerminals.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				fetchEntity={ async (id: number) =>
				{
					const result = await Services.posTerminalsApi.Get(id);
					return result.data;
				} }
				changeDialog={ (dto: PosTerminalDto | undefined, closeDialog) => (
					<ChangePosTerminalDialog
						dto={ dto }
						service={ Services.posTerminalsApi }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								Cubits.posTerminals.add(data);
								closeDialog();
							}
							else if (mode === ChangeableEntityMode.Update)
							{
								Cubits.posTerminals.update(data);
							}
						} }
					/>
				) }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (terminal) => terminal.name }
				service={ Services.posTerminalsApi }
				onSuccess={ (entity) => Cubits.posTerminals.delete(entity) }
			/>
		</CrudPage>
	);
}

function PageTable()
{
	useSignals();

	if (Cubits.posTerminals.state.value instanceof PageLoading) return <TablePreview.Loading/>;
	if (Cubits.posTerminals.state.value instanceof PageError) return <TablePreview.Error/>;

	if (Cubits.posTerminals.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<PosTerminalDto>
					data={ Cubits.posTerminals.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: "رقم الجهاز", rowStyles: "w-24"},
						{rowBody: "الاسم", rowStyles: "w-48"},
						{rowBody: "الفرع", rowStyles: "w-32"},
						{rowBody: "المستودع", rowStyles: "w-32"},
						{rowBody: "العميل الافتراضي", rowStyles: "w-40"},
						{rowBody: "حالة الجلسة", rowStyles: "w-32"}
					] }
					tableRowMapper={ (terminal) => [
						{rowBody: `#${ terminal.id }`, rowStyles: ""},
						{rowBody: terminal.name, rowStyles: "font-semibold"},
						{rowBody: terminal.branchName, rowStyles: ""},
						{rowBody: terminal.storeName, rowStyles: ""},
						{rowBody: terminal.defaultPartnerName || "-", rowStyles: ""},
						{
							rowBody: terminal.activeSession ? "مفتوحة" : "مغلقة",
							rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
								terminal.activeSession ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
							}`
						}
					] }
					hasUpdatePermission={ Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Update) }
					hasDeletePermission={ Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Delete) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.posTerminals.pageSize.value }
					totalNumber={ Cubits.posTerminals.count.value }
					currentPage={ Cubits.posTerminals.currentPage.value }
					onPageChanged={ (newPage) => Cubits.posTerminals.changePage(newPage) }
				/>
			</CrudPage.Table>
		);
	}

	return <TablePreview.Empty/>;
}