import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { DateTimeField, FieldGroup, FormField, NumberField, SearchableSelect, TextField } from "yusr-ui";
import { RouteFilterColumns } from "../../routes/data/route";
import { filterRoutes } from "../../routes/logic/routeSlice";
import type { Trip } from "../data/trip";
import TripStationsList from "./tripStationsList";
import { VehicleFilterColumns, VehicleSlice } from "@/app/core/data/vehicle";

interface TripSidePanelProps
{
  formData: Partial<Trip>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Trip>>>;
  errorInputClass: (field: string) => string;
  clearError: (field: string) => void;
  isInvalid: (field: string) => boolean;
  getError: (field: string) => string;
}

export default function TripHeader(
  { formData, setFormData, clearError, isInvalid, getError }: TripSidePanelProps
)
{
  const routeState = useAppSelector((state) => state.route);
  const vehicleState = useAppSelector((state) => state.vehicle);
  const dispatch = useAppDispatch();

  return (
    <FieldGroup>
      <TextField
        label="اسم قائد المركبة"
        className="h-8 text-xs"
        value={ formData.mainCaptainName || "" }
        isInvalid={ isInvalid("mainCaptainName") }
        error={ getError("mainCaptainName") }
        onChange={ (e) =>
        {
          setFormData((prev) => ({ ...prev, mainCaptainName: e.target.value }));
          clearError("mainCaptainName");
        } }
      />

      <TextField
        label="مساعد القائد"
        className="h-8 text-xs"
        value={ formData.secondaryCaptainName || "" }
        onChange={ (e) => setFormData((prev) => ({ ...prev, secondaryCaptainName: e.target.value })) }
      />

      <DateTimeField
        label="تاريخ ووقت التحرك"
        // todays date
        minDate={ new Date() }
        // className="h-8 text-xs"
        value={ formData.startDate }
        isInvalid={ isInvalid("startDate") }
        error={ getError("startDate") }
        onChange={ (newDate) =>
        {
          setFormData((prev) => ({ ...prev, startDate: newDate }));
          clearError("startDate");
        } }
      />

      <NumberField
        label="مبلغ التذكرة الافتراضي"
        className="h-8 text-xs"
        min={ 0 }
        value={ formData.ticketPrice }
        isInvalid={ isInvalid("ticketPrice") }
        error={ getError("ticketPrice") }
        onChange={ (val) =>
        {
          setFormData((prev) => ({ ...prev, ticketPrice: val }));
          clearError("ticketPrice");
        } }
      />

      <FormField label="الخط" isInvalid={ isInvalid("routeId") } error={ getError("routeId") }>
        <SearchableSelect
          items={ routeState.entities?.data ?? [] }
          itemLabelKey="name"
          itemValueKey="id"
          placeholder="اختر الخط"
          value={ formData.routeId?.toString() || "" }
          onValueChange={ (val) =>
          {
            const selected = routeState.entities?.data?.find((c) => c.id.toString() === val);
            if (selected)
            {
              setFormData((prev) => ({ ...prev, routeId: selected.id, route: selected }));
              clearError("routeId");
            }
          } }
          columnsNames={ RouteFilterColumns.columnsNames }
          onSearch={ (condition) => dispatch(filterRoutes(condition)) }
          isInvalid={ isInvalid("routeId") }
          disabled={ routeState.isLoading }
        />
      </FormField>

      <FormField label="المركبة" required isInvalid={ isInvalid("vehicleId") } error={ getError("vehicleId") }>
        <SearchableSelect
          items={ vehicleState.entities.data ?? [] }
          itemLabelKey="name"
          itemValueKey="id"
          placeholder="اختر المركبة"
          value={ formData.vehicleId?.toString() || "" }
          columnsNames={ VehicleFilterColumns.columnsNames }
          onSearch={ (condition) => dispatch(VehicleSlice.entityActions.filter(condition)) }
          isInvalid={ isInvalid("vehicleId") }
          disabled={ vehicleState.isLoading }
          onValueChange={ (val) =>
          {
            const selected = vehicleState.entities.data?.find((v) => v.id.toString() === val);
            if (selected)
            {
              setFormData({ vehicleId: selected.id });
              setFormData({ vehicle: selected }); // تحديث الكيان بالكامل ليعكس التغيير فوراً
            }
          } }
        />
      </FormField>

      <TripStationsList stations={ formData.route?.routeStations } startDate={ formData.startDate } />
    </FieldGroup>
  );
}
