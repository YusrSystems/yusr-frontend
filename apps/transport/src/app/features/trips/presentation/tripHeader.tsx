import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { DateTimeField, FieldGroup, FormField, NumberField, SearchableSelect, TextField } from "yusr-ui";
import { RouteFilterColumns } from "../../routes/data/route";
import { filterRoutes } from "../../routes/logic/routeSlice";
import type { Trip } from "../data/trip";
import TripStationsList from "./tripStationsList";

interface TripSidePanelProps {
  formData: Partial<Trip>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Trip>>>;
  errorInputClass: (field: string) => string;
  clearError: (field: string) => void;
  isInvalid: (field: string) => boolean;
  getError: (field: string) => string;
}

export default function TripHeader(
  { formData, setFormData, errorInputClass, clearError, isInvalid, getError }: TripSidePanelProps
) {
  const routeState = useAppSelector((state) => state.route);
  const dispatch = useAppDispatch();

  return (
    <FieldGroup>
      <TextField
        label="اسم قائد الحافلة"
        className="h-8 text-xs"
        value={formData.mainCaptainName || ""}
        isInvalid={isInvalid("mainCaptainName")}
        error={getError("mainCaptainName")}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, mainCaptainName: e.target.value }));
          clearError("mainCaptainName");
        }}
      />

      <TextField
        label="مساعد القائد"
        className="h-8 text-xs"
        value={formData.secondaryCaptainName || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, secondaryCaptainName: e.target.value }))}
      />

      <TextField
        label="الحافلة"
        className="h-8 text-xs"
        value={formData.busName || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, busName: e.target.value }))}
      />

      <DateTimeField
        label="تاريخ ووقت التحرك"
        // todays date
        minDate={new Date()}
        // className="h-8 text-xs"
        value={formData.startDate}
        isInvalid={isInvalid("startDate")}
        error={getError("startDate")}
        onChange={(newDate) => {
          setFormData((prev) => ({ ...prev, startDate: newDate }));
          clearError("startDate");
        }}

      />

      <NumberField
        label="مبلغ التذكرة الافتراضي"
        className="h-8 text-xs"
        min={0}
        value={formData.ticketPrice}
        isInvalid={isInvalid("ticketPrice")}
        error={getError("ticketPrice")}
        onChange={(val) => {
          setFormData((prev) => ({ ...prev, ticketPrice: val }));
          clearError("ticketPrice");
        }}
      />

      <FormField label="الخط" isInvalid={isInvalid("routeId")} error={getError("routeId")}>
        <SearchableSelect
          items={routeState.entities?.data ?? []}
          itemLabelKey="name"
          itemValueKey="id"
          placeholder="اختر الخط"
          value={formData.routeId?.toString() || ""}
          onValueChange={(val) => {
            const selected = routeState.entities?.data?.find((c) => c.id.toString() === val);
            if (selected) {
              setFormData((prev) => ({ ...prev, routeId: selected.id, route: selected }));
              clearError("routeId");
            }
          }}
          columnsNames={RouteFilterColumns.columnsNames}
          onSearch={(condition) => dispatch(filterRoutes(condition))}
          errorInputClass={errorInputClass("routeId")}
          disabled={routeState.isLoading}
        />
      </FormField>

      <TripStationsList stations={formData.route?.routeStations} startDate={formData.startDate} />
    </FieldGroup>
  );
}
