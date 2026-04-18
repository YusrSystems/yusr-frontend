import { useTripForm } from "@/app/core/hooks/useTripForm";
import PassengersApiService from "@/app/core/networking/passengersApiService";
import TripsApiService from "@/app/core/networking/tripsApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import type { CommonChangeDialogProps } from "yusr-ui";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Loading,
  SaveButton,
  Separator,
  SearchableSelect,
  FormField,
} from "yusr-ui";
import { useEffect, useState, useMemo } from "react";
import type { Passenger } from "../../passengers/data/passenger";
import { refreshPassengers } from "../../passengers/logic/passengerSlice";
import ChangePassengerDialog from "../../passengers/presentation/changePassengerDialog";
import { filterRoutes } from "../../routes/logic/routeSlice";
import type { Trip } from "../data/trip";
import ChangeDepositDialog from "./changeDepositDialog";
import ChangeTicketDialog from "./changeTicketDialog";
import TripAmountSummary from "./TripAmountSummary";
import TripDeposits from "./tripDeposits";
import TripHeader from "./tripHeader";
import { VehicleFilterColumns, VehicleSlice } from "@/app/core/data/vehicle";
import Vehicle from "./vehicle/vehicle";

export default function ChangeTripDialog({ entity, mode, onSuccess }: CommonChangeDialogProps<Trip>) {
  const {
    formData,
    handleChange,
    movingTicket,
    setMovingTicket,
    validate,
    initLoading,
    isInvalid,
    getError,
    clearError,
    errorInputClass,
    handleSeatClick,
    handleTicketUpdate,
    handleTicketCheckInUpdate,
    handleDepositOpen,
    selectedTicket,
    setSelectedTicket,
    selectedDeposit,
    isTicketDialogOpen,
    setIsTicketDialogOpen,
    isDepositDialogOpen,
    setIsDepositDialogOpen,
  } = useTripForm(entity, mode);

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | undefined>(undefined);
  const [isEditPassengerDialogOpen, setIsEditPassengerDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const vehicleState = useAppSelector((state) => state.vehicle);

  useEffect(() => {
    dispatch(filterRoutes());
    dispatch(VehicleSlice.entityActions.filter(undefined));
  }, [dispatch]);

  const { seats, chairsPerRow } = useMemo(() => {
    let selectedVehicle = vehicleState.entities?.data?.find(v => v.id === formData.vehicleId);

    if (!selectedVehicle && formData.vehicle) {
      selectedVehicle = formData.vehicle;
    }

    const numberOfSeats = selectedVehicle?.chairsNumber || 44;
    const perRow = selectedVehicle?.chairsNumberPerRow || 4;

    return {
      seats: Array.from({ length: numberOfSeats }, (_, i) => ({ id: i + 1 })),
      chairsPerRow: perRow
    };
  }, [formData.vehicleId, formData.vehicle, vehicleState.entities?.data]);

  if (initLoading) {
    return (
      <DialogContent dir="rtl" aria-describedby={undefined}>
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} رحلة</DialogTitle>
          </div>
        </DialogHeader>
        <Loading entityName="الرحلة" />
      </DialogContent>
    );
  }

  return (
    <DialogContent
      aria-describedby={undefined}
      dir="rtl"
      className="sm:max-w-[100vw] sm:w-screen sm:h-screen flex flex-col p-0 gap-0 overflow-hidden"
    >
      <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
        <div>
          <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} رحلة</DialogTitle>
        </div>
      </DialogHeader>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-100 transition-all duration-300 border-l bg-muted/10 shrink-0 shadow-inner flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
            <section>
              <h3 className="font-bold tracking-widest mb-3">
                تفاصيل الرحلة
                <Separator className="mt-1 mb-3" />
              </h3>
              <TripHeader
                formData={formData}
                setFormData={handleChange}
                errorInputClass={errorInputClass}
                clearError={clearError}
                isInvalid={isInvalid}
                getError={getError}
              />

              {/* Vehicle Selection */}
              <FormField label="المركبة" required isInvalid={isInvalid("vehicleId")} error={getError("vehicleId")}>
                <SearchableSelect
                  items={vehicleState.entities.data ?? []}
                  itemLabelKey="name"
                  itemValueKey="id"
                  placeholder="اختر المركبة"
                  value={formData.vehicleId?.toString() || ""}
                  columnsNames={VehicleFilterColumns.columnsNames}
                  onSearch={(condition) => dispatch(VehicleSlice.entityActions.filter(condition))}
                  errorInputClass={errorInputClass("vehicleId")}
                  disabled={vehicleState.isLoading}
                  onValueChange={(val) => {
                    const selected = vehicleState.entities.data?.find((v) => v.id.toString() === val);
                    if (selected) {
                      handleChange({ vehicleId: selected.id });
                      handleChange({ vehicle: selected }); // تحديث الكيان بالكامل ليعكس التغيير فوراً
                    }
                  }}
                />
              </FormField>
            </section>

            <section>
              <h3 className="font-bold tracking-widest">
                الأمانات
                <Separator className="mt-1 mb-3" />
              </h3>
              <TripDeposits
                deposits={formData.deposits ?? []}
                onDepositDeleted={(i) =>
                  handleChange((prev) => ({ ...prev, deposits: prev.deposits?.filter((_, idx) => idx !== i) }))
                }
                onDepositDialogOpened={(deposit) => handleDepositOpen(deposit)}
              />
            </section>
          </div>

          <section className="p-4 border-t bg-background/50 backdrop-blur-sm flex flex-col gap-2">
            <SaveButton
              formData={formData as Trip}
              dialogMode={mode}
              service={new TripsApiService()}
              onSuccess={(trip) => {
                const updatedTrip = { ...trip, startDate: trip.startDate ? new Date(trip.startDate) : undefined };

                handleChange(updatedTrip);
                onSuccess?.(updatedTrip as Trip, mode);
              }}
              validate={validate}
            />
            <DialogClose asChild>
              <Button variant="outline" className="w-full h-8 text-xs">إلغاء</Button>
            </DialogClose>
          </section>
        </aside>

        <main className="flex-1 overflow-hidden flex flex-col bg-background relative">
          <TripAmountSummary trip={formData as Trip} />

          <div className="flex-1 overflow-auto custom-scrollbar flex flex-col items-center justify-start p-4">
            <Vehicle
              isLoading={initLoading}
              seats={seats}
              chairsPerRow={chairsPerRow}
              tickets={formData.tickets ?? []}
              onSeatClick={handleSeatClick}
              onCheckInUpdate={handleTicketCheckInUpdate}
              onMoveTicket={(t) => setMovingTicket(t || undefined)}
              movingTicketId={movingTicket?.id || movingTicket?.chairNo}
              onDeleteTicket={(id) => handleChange((p) => ({ ...p, tickets: p.tickets?.filter((t) => t.id !== id) }))}
            />
          </div>
        </main>
      </div>

      {/* Nested Ticket Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        {isTicketDialogOpen && (
          <ChangeTicketDialog
            entity={selectedTicket}
            onPassengerDialogClicked={(p) => {
              setSelectedPassenger(p);
              setIsEditPassengerDialogOpen(true);
            }}
            onSuccess={handleTicketUpdate}
          />
        )}
      </Dialog>

      {/* Nested Passenger Dialog */}
      <Dialog open={isEditPassengerDialogOpen} onOpenChange={setIsEditPassengerDialogOpen}>
        {isEditPassengerDialogOpen && (
          <ChangePassengerDialog
            entity={selectedPassenger}
            mode={selectedPassenger ? "update" : "create"}
            service={new PassengersApiService()}
            onSuccess={(data) => {
              dispatch(refreshPassengers({ data: data }));
              setSelectedTicket((prev) => prev ? { ...prev, passengerId: data.id, passenger: data } : prev);
              setIsEditPassengerDialogOpen(false);
            }}
          />
        )}
      </Dialog>

      {/* Nested Deposit Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        {isDepositDialogOpen && (
          <ChangeDepositDialog
            entity={selectedDeposit}
            onSuccess={(dep) => {
              handleChange((prev) => {
                const existingDeposits = prev.deposits ?? [];
                const isExisting = dep.id && existingDeposits.some((d) => d.id === dep.id);

                const updatedDeposits = isExisting
                  ? existingDeposits.map((d) => (d.id === dep.id ? dep : d))
                  : [...existingDeposits, dep];

                return { ...prev, deposits: updatedDeposits };
              });

              setIsDepositDialogOpen(false);
            }}
          />
        )}
      </Dialog>
    </DialogContent>
  );
}