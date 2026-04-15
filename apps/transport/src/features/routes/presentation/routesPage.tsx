import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import RoutesApiService from "@/app/core/networking/routesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { CrudPage } from "@yusr_systems/ui";
import { Building } from "lucide-react";
import { useMemo } from "react";
import { type Route, RouteFilterColumns } from "../data/route";
import { openRouteChangeDialog, openRouteDeleteDialog, setIsRouteChangeDialogOpen, setIsRouteDeleteDialogOpen } from "../logic/routeDialogSlice";
import { filterRoutes, refreshRoutes, setCurrentRoutesPage } from "../logic/routeSlice";
import ChangeRouteDialog from "./changeRouteDialog";

export default function RoutesPage()
{
  const dispatch = useAppDispatch();
  const routeState = useAppSelector((state) => state.route);
  const routeDialogState = useAppSelector((state) => state.routeDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Routes));
  const service = useMemo(() => new RoutesApiService(), []);

  return (
    <CrudPage<Route>
      title="إدارة الخطوط"
      entityName="الخط"
      addNewItemTitle="إضافة خط جديد"
      permissions={ permissions }
      entityState={ routeState }
      useSlice={ () => routeDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الخطوط",
        data: (routeState.entities?.count ?? 0).toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ RouteFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الخط", rowStyles: "w-30" },
        { rowName: "اسم الخط", rowStyles: "" },
        { rowName: "من المدينة", rowStyles: "" },
        { rowName: "إلى المدينة", rowStyles: "" }
      ] }
      tableRowMapper={ (
        route: Route
      ) => [{ rowName: `#${route.id}`, rowStyles: "" }, { rowName: route.name, rowStyles: "font-semibold" }, {
        rowName: route.fromCityName,
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }, {
        rowName: route.toCityName,
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }] }
      actions={ {
        filter: filterRoutes,
        openChangeDialog: (entity) => openRouteChangeDialog(entity),
        openDeleteDialog: (entity) => openRouteDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsRouteChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsRouteDeleteDialogOpen(open),
        refresh: refreshRoutes,
        setCurrentPage: (page) => setCurrentRoutesPage(page)
      } }
      ChangeDialog={ 
        <ChangeRouteDialog
          entity={ routeDialogState.selectedRow || undefined }
          mode={ routeDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(refreshRoutes({ data: data }));
            if (mode === "create")
            {
              dispatch(setIsRouteChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
