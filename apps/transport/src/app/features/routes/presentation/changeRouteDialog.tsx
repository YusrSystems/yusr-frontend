import { filterCities } from "@/app/core/state/shared/citySlice";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CityFilterColumns, type ValidationRule, Validators } from "yusr-ui";
import type { CommonChangeDialogProps } from "yusr-ui";
import { Button, ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DynamicListContainer, FieldGroup, FormField, Loading, NumberInput, SearchableSelect, Separator, TextField, useDynamicList, useEntityForm } from "yusr-ui";
import { Route, RouteStation } from "../data/route";

export default function ChangeRouteDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Route>)
{
  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Route>>[] = useMemo(
    () => [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required("يرجى إدخال اسم الخط")]
    }, {
      field: "fromCityId",
      selector: (d) => d.fromCityId,
      validators: [Validators.required("يرجى اختيار مدينة الانطلاق")]
    }, {
      field: "toCityId",
      selector: (d) => d.toCityId,
      validators: [Validators.required("يرجى اختيار مدينة الوصول")]
    }, {
      field: "stations",
      selector: (d) => d.routeStations,
      validators: [Validators.custom<RouteStation[]>((stations) =>
      {
        return stations.every((s) => s.cityId && (s.period ?? 0) > 0);
      }, "يجب تحديد المدينة والمدة لجميع المحطات")]
    }],
    []
  );

  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Route>(
    entity,
    validationRules
  );
  const [initLoading, setInitLoading] = useState(false);
  const { addRow, removeRow, updateRow } = useDynamicList("routeStations", handleChange, clearError);

  const handleAdd = () => addRow({ index: (formData.routeStations?.length || 0) + 1, period: 0, cityName: "" });

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);

      const getRoute = async () =>
      {
        const res = await service.Get(entity.id);
        handleChange({ ...res.data });
        setInitLoading(false);
      };

      getRoute();
    }
    else
    {
      handleChange((prev) => ({ ...prev, routeStations: [] }));
    }
  }, [entity?.id, mode]);

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{ mode === "create" ? "إضافة" : "تعديل" } خط</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Loading entityName="الخط" />
      </DialogContent>
    );
  }

  return (
    <ChangeDialog<Route>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} خط` }
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <TextField
          label="اسم الخط"
          required
          value={ formData.name || "" }
          onChange={ (e) => handleChange({ name: e.target.value }) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />

        <div className="flex gap-3">
          <FormField label="من المدينة" required isInvalid={ isInvalid("fromCityId") } error={ getError("fromCityId") }>
            <SearchableSelect
              items={ cityState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={ formData.fromCityId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                if (city)
                {
                  handleChange((prev) => ({ ...prev, fromCityId: city.id, fromCityName: city.name }));
                  clearError("fromCityId");
                }
              } }
              columnsNames={ CityFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterCities(condition)) }
              isLoading={ cityState.isLoading }
              disabled={ cityState.isLoading }
            />
          </FormField>

          <FormField label="إلى المدينة" required isInvalid={ isInvalid("toCityId") } error={ getError("toCityId") }>
            <SearchableSelect
              items={ cityState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={ formData.toCityId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                if (city)
                {
                  handleChange((prev) => ({ ...prev, toCityId: city.id, toCityName: city.name }));
                  clearError("toCityId");
                }
              } }
              columnsNames={ CityFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterCities(condition)) }
              isLoading={ cityState.isLoading }
              disabled={ cityState.isLoading }
            />
          </FormField>
        </div>

        <Separator />

        <DynamicListContainer
          title="محطات الخط"
          addLabel="إضافة محطة"
          emptyMessage="لا توجد محطات مضافة لهذا الخط بعد."
          items={ formData.routeStations || [] }
          onAdd={ handleAdd }
          headers={ ["المدينة", "مدة الوصول (ساعة)"] }
          error={ getError("stations") }
        >
          { (station: RouteStation, index) =>
          {
            const hasGlobalError = !!getError("stations");
            const isCityMissing = !station.cityId;
            const isPeriodInvalid = (station.period ?? 0) <= 0;

            return (
              <div
                key={ index }
                className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/5 transition-colors"
              >
                <div className="flex-1 cursor-pointer">
                  <SearchableSelect
                    items={ cityState.entities.data ?? [] }
                    itemLabelKey="name"
                    itemValueKey="id"
                    placeholder="اختر المدينة"
                    value={ station.cityId?.toString() || "" }
                    onValueChange={ (val) =>
                    {
                      updateRow(index, "cityId", Number(val));

                      const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                      if (city)
                      {
                        updateRow(index, "cityName", city.name);
                      }
                    } }
                    columnsNames={ CityFilterColumns.columnsNames }
                    onSearch={ (condition) => dispatch(filterCities(condition)) }
                    isLoading={ cityState.isLoading }
                    isInvalid={ hasGlobalError && isCityMissing }
                    disabled={ cityState.isLoading }
                  />
                </div>

                <div className="w-24">
                  <NumberInput
                    step="0.1"
                    placeholder="0.0"
                    value={ station.period ?? "" }
                    isInvalid={ hasGlobalError && isPeriodInvalid }
                    onChange={ (val) =>
                    {
                      updateRow(index, "period", val);
                    } }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-10 text-destructive hover:bg-destructive/10"
                  onClick={ () => removeRow(index, "index") } // Pass "index" to reorder
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          } }
        </DynamicListContainer>
      </FieldGroup>
    </ChangeDialog>
  );
}
