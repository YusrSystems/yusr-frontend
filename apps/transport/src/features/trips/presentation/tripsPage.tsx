import { selectPermissionsByResource } from "@/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import TripsApiService from "@/core/networking/tripsApiService";
import { useAppDispatch, useAppSelector } from "@/core/state/store";
import { CrudPage } from "yusr-ui";
import { Building } from "lucide-react";
import { useMemo } from "react";
import { Trip, TripFilterColumns } from "../data/trip";
import { openTripChangeDialog, openTripDeleteDialog, setIsTripChangeDialogOpen, setIsTripDeleteDialogOpen } from "../logic/tripDialogSlice";
import { filterTrips, refreshTrips, setCurrentTripsPage } from "../logic/tripSlice";
import ChangeTripDialog from "./changeTripDialog";

export default function TripsPage() {
  const dispatch = useAppDispatch();
  const tripState = useAppSelector((state) => state.trip);
  const tripDialogState = useAppSelector((state) => state.tripDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Trips));
  const service = useMemo(() => new TripsApiService(), []);
  return (
    <CrudPage<Trip>
      title="إدارة الرحلات"
      entityName="الرحلة"
      addNewItemTitle="إضافة رحلة جديدة"
      permissions={permissions}
      entityState={tripState}
      useSlice={() => tripDialogState}
      service={service}
      cards={[{
        title: "إجمالي الرحلات",
        data: (tripState.entities?.count ?? 0).toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }]}
      columnsToFilter={TripFilterColumns.columnsNames}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الرحلة", rowStyles: "w-30" },
        { rowName: "اسم قائد الحافلة", rowStyles: "" },
        { rowName: "اسم مساعد قائد الحافلة", rowStyles: "" },
        { rowName: "اسم الحافلة (اذا توفر)", rowStyles: "" },
        { rowName: "تاريخ بدء الرحلة", rowStyles: "" }
      ]}
      tableRowMapper={(
        trip: Trip
      ) => [{ rowName: `#${trip.id}`, rowStyles: "" }, { rowName: trip.mainCaptainName, rowStyles: "font-semibold" }, {
        rowName: trip.secondaryCaptainName ?? "",
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }, {
        rowName: trip.busName ?? "",
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }, {
        rowName: new Date(trip.startDate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }]}
      actions={{
        filter: filterTrips,
        openChangeDialog: (entity) => openTripChangeDialog(entity),
        openDeleteDialog: (entity) => openTripDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsTripChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsTripDeleteDialogOpen(open),
        refresh: refreshTrips,
        setCurrentPage: (page) => setCurrentTripsPage(page)
      }}
      ChangeDialog={
        <ChangeTripDialog
          entity={tripDialogState.selectedRow || undefined}
          mode={tripDialogState.selectedRow ? "update" : "create"}
          service={new TripsApiService()}
          onSuccess={(data, mode) => {
            dispatch(refreshTrips({ data }));
            if (mode === "create") {
              dispatch(setIsTripChangeDialogOpen(false));
            }
          }}
        />
      }
    >
    </CrudPage>
  );
}
