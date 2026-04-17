import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import type Vehicle from "@/app/core/data/vehicle";
import { VehicleFilterColumns, VehicleSlice } from "@/app/core/data/vehicle";
import VehiclesApiService from "@/app/core/data/vehiclesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { BusIcon } from "lucide-react";
import { useMemo } from "react";
import { CrudPage } from "yusr-ui";
import ChangeVehicleDialog from "./changeVehicleDialog";

export default function VehiclesPage() {
    const dispatch = useAppDispatch();
    const vehicleState = useAppSelector((state) => state.vehicle);
    const vehicleDialogState = useAppSelector((state) => state.vehicleDialog);

    // تأكد من إضافة Vehicles إلى SystemPermissionsResources في مشروعك
    const permissions = useAppSelector((state) =>
        selectPermissionsByResource(state, SystemPermissionsResources.Vehicles)
    );

    const service = useMemo(() => new VehiclesApiService(), []);

    return (
        <CrudPage<Vehicle>
            title="إدارة المركبات"
            entityName="المركبة"
            addNewItemTitle="إضافة مركبة جديدة"
            permissions={permissions}
            entityState={vehicleState}
            useSlice={() => vehicleDialogState}
            service={service}
            cards={[
                {
                    title: "إجمالي المركبات",
                    data: (vehicleState.entities?.count ?? 0).toString(),
                    icon: <BusIcon className="h-4 w-4 text-muted-foreground" />,
                },
            ]}
            columnsToFilter={VehicleFilterColumns.columnsNames}
            tableHeadRows={[
                { rowName: "", rowStyles: "text-left w-12.5" },
                { rowName: "رقم المركبة", rowStyles: "w-20" },
                { rowName: "اسم المركبة", rowStyles: "w-40" },
                { rowName: "الشركة المصنعة", rowStyles: "w-30" },
                { rowName: "الموديل", rowStyles: "w-30" },
                { rowName: "عدد المقاعد", rowStyles: "w-20" },
            ]}
            tableRowMapper={(vehicle: Vehicle) => [
                { rowName: `#${vehicle.id}`, rowStyles: "" },
                { rowName: vehicle.name, rowStyles: "font-semibold" },
                { rowName: vehicle.make || "-", rowStyles: "" },
                { rowName: vehicle.model || "-", rowStyles: "" },
                { rowName: vehicle.chairsNumber.toString(), rowStyles: "" },
            ]}
            actions={{
                filter: VehicleSlice.entityActions.filter,
                openChangeDialog: (entity) => VehicleSlice.dialogActions.openChangeDialog(entity),
                openDeleteDialog: (entity) => VehicleSlice.dialogActions.openDeleteDialog(entity),
                setIsChangeDialogOpen: (open) => VehicleSlice.dialogActions.setIsChangeDialogOpen(open),
                setIsDeleteDialogOpen: (open) => VehicleSlice.dialogActions.setIsDeleteDialogOpen(open),
                refresh: VehicleSlice.entityActions.refresh,
                setCurrentPage: (page) => VehicleSlice.entityActions.setCurrentPage(page),
            }}
            ChangeDialog={
                <ChangeVehicleDialog
                    entity={vehicleDialogState.selectedRow || undefined}
                    mode={vehicleDialogState.selectedRow ? "update" : "create"}
                    service={service}
                    onSuccess={(data, mode) => {
                        dispatch(VehicleSlice.entityActions.refresh({ data: data }));
                        if (mode === "create") {
                            dispatch(VehicleSlice.dialogActions.setIsChangeDialogOpen(false));
                        }
                    }}
                />
            }
        />
    );
}