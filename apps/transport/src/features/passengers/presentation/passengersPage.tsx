import { selectPermissionsByResource } from "@/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import PassengersApiService from "@/core/networking/passengersApiService";
import { useAppDispatch, useAppSelector } from "@/core/state/store";
import { CrudPage } from "yusr-ui";
import { Building } from "lucide-react";
import { useMemo } from "react";
import { Passenger, PassengerFilterColumns } from "../data/passenger";
import { openPassengerChangeDialog, openPassengerDeleteDialog, setIsPassengerChangeDialogOpen, setIsPassengerDeleteDialogOpen } from "../logic/passengerDialogSlice";
import { filterPassengers, refreshPassengers, setCurrentPassengersPage } from "../logic/passengerSlice";
import ChangePassengerDialog from "./changePassengerDialog";

export default function PassengersPage() {
  const dispatch = useAppDispatch();
  const passengerState = useAppSelector((state) => state.passenger);
  const passengerDialogState = useAppSelector((state) => state.passengerDialog);
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Passengers)
  );
  const service = useMemo(() => new PassengersApiService(), []);

  return (
    <CrudPage<Passenger>
      title="إدارة الركاب"
      entityName="الراكب"
      addNewItemTitle="إضافة راكب جديد"
      permissions={permissions}
      entityState={passengerState}
      useSlice={() => passengerDialogState}
      service={service}
      cards={[{
        title: "إجمالي الركاب",
        data: (passengerState.entities?.count ?? 0).toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }]}
      columnsToFilter={PassengerFilterColumns.columnsNames}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الراكب", rowStyles: "w-30" },
        { rowName: "اسم الراكب", rowStyles: "" },
        { rowName: "الجنس", rowStyles: "" },
        { rowName: "رقم الجوال", rowStyles: "" },
        { rowName: "البريد الإلكتروني", rowStyles: "" },
        { rowName: "الجنسية", rowStyles: "" }
      ]}
      tableRowMapper={(
        passenger: Passenger
      ) => [
          { rowName: `#${passenger.id}`, rowStyles: "" },
          { rowName: passenger.name, rowStyles: "font-semibold" },
          {
            rowName: passenger.gender === 0 ? "ذكر" : "أنثى",
            rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${passenger.gender === 0 ? "bg-blue-300" : "bg-pink-300"
              } text-slate-800`
          },
          { rowName: passenger.phoneNumber ?? "-", rowStyles: "" },
          { rowName: passenger.email ?? "-", rowStyles: "" },
          {
            rowName: passenger.nationality?.name ?? "-",
            rowStyles:
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-300 text-slate-800"
          }
        ]}
      actions={{
        filter: filterPassengers,
        openChangeDialog: (entity) => openPassengerChangeDialog(entity),
        openDeleteDialog: (entity) => openPassengerDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsPassengerChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsPassengerDeleteDialogOpen(open),
        refresh: refreshPassengers,
        setCurrentPage: (page) => setCurrentPassengersPage(page)
      }}
      ChangeDialog={
        <ChangePassengerDialog
          entity={passengerDialogState.selectedRow || undefined}
          mode={passengerDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(refreshPassengers({ data }));
            if (mode === "create") {
              dispatch(setIsPassengerChangeDialogOpen(false));
            }
          }}
        />
      }
    >
    </CrudPage>
  );
}
