import { CityFilterColumns } from "@/app/core/data/city";
import { filterCities } from "@/app/core/state/shared/citySlice";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { type ValidationRule, Validators } from "yusr-core";
import { Button, ChangeDialog, DateField, FieldGroup, FormField, NumberField, SearchableSelect, TextField, useEntityForm } from "yusr-ui";
import { Edit, PlusCircle, PrinterCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { type Passenger, PassengerFilterColumns } from "../../passengers/data/passenger";
import { filterPassengers } from "../../passengers/logic/passengerSlice";
import type { Ticket } from "../data/ticket";

type ChangeTicketDialogProps = {
  entity?: Ticket;
  onPassengerDialogClicked?: (passenger?: Passenger) => void;
  onSuccess?: (newData: Ticket) => void;
};

export default function ChangeTicketDialog({ entity, onPassengerDialogClicked, onSuccess }: ChangeTicketDialogProps) {
  const cityState = useAppSelector((state) => state.city);
  const passengerState = useAppSelector((state) => state.passenger);
  const dispatch = useAppDispatch();
  const validationRules: ValidationRule<Partial<Ticket>>[] = useMemo(
    () => [{
      field: "passengerId",
      selector: (d) => d.passengerId,
      validators: [Validators.required("يرجى اختيار راكب")]
    }, {
      field: "fromCityId",
      selector: (d) => d.fromCityId,
      validators: [Validators.required("يرجى اختيار مدينة المغادرة")]
    }, {
      field: "toCityId",
      selector: (d) => d.toCityId,
      validators: [Validators.required("يرجى اختيار مدينة الوجهة")]
    }, {
      field: "amount",
      selector: (d) => d.amount,
      validators: [Validators.min(0, "يرجى ادخال المبلغ المطلوب دفعه")]
    }, {
      field: "issueDate",
      selector: (d) => d.issueDate,
      validators: [Validators.required("يرجى ادخال تاريخ الاصدار")]
    }, {
      field: "issueCityId",
      selector: (d) => d.issueCityId,
      validators: [Validators.required("يرجى اختيار مدينة الاصدار")]
    }],
    []
  );
  const { formData, handleChange, getError, isInvalid, validate, errorInputClass, clearError } = useEntityForm<Ticket>(
    entity,
    validationRules
  );

  useEffect(() => {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (!passengerState.isLoaded) {
      dispatch(filterPassengers(undefined));
    }
  }, []);

  const passengerItems =
    passengerState.entities.data?.map((p) => ({ ...p, displayLabel: `${p.name} - ${p.passportNo}` })) || [];

  return (
    <ChangeDialog
      title="بيانات التذكرة"
      className="sm:max-w-4xl"
      formData={formData as Ticket}
      validate={validate}
      onSuccess={(data) => onSuccess?.(data as Ticket)}
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          {entity?.id &&
            <TextField label="رقم التذكرة" value={entity?.id || ""} disabled />
          }
          <TextField
            label="رقم الكرسي"
            value={(entity?.chairNo ?? -1) < 0 ? "0" : entity?.chairNo?.toString()}
            disabled
          />
        </div>

        <FormField label="الراكب" isInvalid={isInvalid("passengerId")} error={getError("passengerId")}>
          <div className="flex w-full gap-2">
            <div className="flex-9">
              <SearchableSelect
                items={passengerItems}
                itemLabelKey="displayLabel"
                itemValueKey="id"
                placeholder="اختر الراكب"
                value={formData.passengerId?.toString() || ""}
                onValueChange={(val) => {
                  const selectedPassenger = passengerState.entities.data?.find((c) => c.id.toString() === val);
                  if (selectedPassenger) {
                    handleChange((prev) => ({
                      ...prev,
                      passengerId: selectedPassenger.id,
                      passenger: selectedPassenger
                    }));
                    clearError("passengerId");
                  }
                }}
                columnsNames={PassengerFilterColumns.columnsNames}
                onSearch={(condition) => dispatch(filterPassengers(condition))}
                errorInputClass={errorInputClass("passengerId")}
                disabled={passengerState.isLoading}
              />
            </div>

            <Button variant="outline" className="flex-1 gap-2" onClick={() => onPassengerDialogClicked?.(undefined)}>
              <PlusCircle className="h-4 w-4" />
              إضافة
            </Button>

            {formData.passenger && (
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => {
                  console.log(formData.passenger);
                  onPassengerDialogClicked?.(formData.passenger!);
                }}
              >
                <Edit className="h-4 w-4" />
                تعديل
              </Button>
            )}
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="من المدينة" isInvalid={isInvalid("fromCityId")} error={getError("fromCityId")}>
            <SearchableSelect
              items={cityState.entities.data ?? []}
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={formData.fromCityId?.toString() || ""}
              onValueChange={(val) => {
                const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
                handleChange({ ...formData, fromCityId: selectedCity?.id, fromCityName: selectedCity?.name });
                clearError("fromCityId");
              }}
              columnsNames={CityFilterColumns.columnsNames}
              onSearch={(condition) => dispatch(filterCities(condition))}
              errorInputClass={errorInputClass("fromCityId")}
              disabled={cityState.isLoading}
            />
          </FormField>

          <FormField label="إلى المدينة" isInvalid={isInvalid("toCityId")} error={getError("toCityId")}>
            <SearchableSelect
              items={cityState.entities.data ?? []}
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={formData.toCityId?.toString() || ""}
              onValueChange={(val) => {
                const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
                handleChange({ ...formData, toCityId: selectedCity?.id, toCityName: selectedCity?.name });
                clearError("toCityId");
              }}
              columnsNames={CityFilterColumns.columnsNames}
              onSearch={(condition) => dispatch(filterCities(condition))}
              errorInputClass={errorInputClass("toCityId")}
              disabled={cityState.isLoading}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="المبلغ"
            value={formData.amount}
            isInvalid={isInvalid("amount")}
            error={getError("amount")}
            onChange={(val) => {
              handleChange({ amount: val });
              clearError("amount");
            }}
          />
          <NumberField
            label="المبلغ المدفوع"
            value={formData.paidAmount}
            onChange={(val) => handleChange({ paidAmount: val })}
          />
        </div>

        <div className="flex gap-3">
          <DateField
            label="تاريخ الإصدار"
            value={formData.issueDate}
            onChange={(date) => {
              handleChange({ issueDate: date });
              clearError("issueDate");
            }}
            isInvalid={isInvalid("issueDate")}
            error={getError("issueDate")}
            placeholder="اختر تاريخاً"
          />

          <FormField label="مكان الإصدار" isInvalid={isInvalid("issueCityId")} error={getError("issueCityId")}>
            <SearchableSelect
              items={cityState.entities.data ?? []}
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر مدينة الإصدار"
              value={formData.issueCityId?.toString() || ""}
              onValueChange={(val) => {
                handleChange({ issueCityId: Number(val) });
                clearError("issueCityId");
              }}
              columnsNames={CityFilterColumns.columnsNames}
              onSearch={(condition) => dispatch(filterCities(condition))}
              errorInputClass={errorInputClass("issueCityId")}
              disabled={cityState.isLoading}
            />
          </FormField>
        </div>

        <TextField
          label="الملاحظات"
          placeholder="أي ملاحظات إضافية ..."
          value={formData.notes || ""}
          onChange={(e) => handleChange({ notes: e.target.value })}
        />
      </FieldGroup>

      <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-xs shadow-sm">
        <div className="grid grid-cols-2 gap-8">
          { /* الجهة اليمنى: المنشئ */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-green-700">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                أضيفت بواسطة: {entity?.createdBy?.username || "—"}
              </span>
              <span className="text-muted-foreground">الفرع: {entity?.createdBy?.branch?.name || "—"}</span>
            </div>
          </div>

          { /* الجهة اليسرى: الطابعة */}
          <div className="flex items-center gap-2 border-r pr-8">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${entity?.printedBy ? "bg-primary/10 text-green-700" : "bg-primary/10 text-orange-700"
                }`}
            >
              <PrinterCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              {entity?.printedBy
                ? (
                  <>
                    <span className="font-semibold text-foreground">طُبعت بواسطة: {entity.printedBy.username}</span>
                    <span className="text-muted-foreground text-[10px]">الفرع: {entity.printedBy.branch?.name}</span>
                  </>
                )
                : <span className="text-orange-600 font-medium italic">لم تُطبع بعد</span>}
            </div>
          </div>
        </div>
      </div>
    </ChangeDialog>
  );
}
