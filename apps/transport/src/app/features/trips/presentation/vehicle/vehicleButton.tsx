import { CheckCircle2 } from "lucide-react";
import { cn } from "yusr-ui";
import type { Ticket } from "../../data/ticket";
import type { SeatType } from "./vehicleTypes";

type VehicleButtonProps = {
  seat: SeatType;
  ticket?: Ticket;
  isDimmed?: boolean;
  isMoveTarget?: boolean;
  isCheckedIn?: boolean;
  isOccupied: boolean;
  highlighted?: boolean;

  onClick: (seat: SeatType) => void;
  onHoverData?: (type: "nationality" | "from" | "to" | "amount" | null, value?: string) => void;

  handleContextMenuAction: (e: React.MouseEvent<Element, MouseEvent>) => void;
};
export default function VehicleButton(
  {
    seat,
    ticket,
    isDimmed,
    isMoveTarget,
    isCheckedIn,
    isOccupied,
    highlighted,

    onClick,
    onHoverData,
    handleContextMenuAction
  }: VehicleButtonProps
)
{
  return (
    <button
      dir="rtl"
      type="button"
      onClick={ () => onClick(seat) }
      onContextMenu={ handleContextMenuAction }
      className={ cn(
        "group relative flex h-22 w-18 flex-col items-center transition-all duration-300 ease-in-out outline-none",
        isDimmed ? "opacity-30 grayscale-[0.5] scale-95" : "hover:scale-105 active:scale-95",
        highlighted && "scale-110 z-50 ring-2 ring-yellow-400 ring-offset-2 rounded-lg",
        isMoveTarget && "animate-pulse ring-2 ring-dashed ring-emerald-500 rounded-lg scale-105 bg-emerald-50/50"
      ) }
    >
      { /* Checked-in Badge Icon */ }
      { isCheckedIn && (
        <div className="absolute -top-2 -right-2 z-20 bg-white rounded-full shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
        </div>
      ) }

      { /* Headrest */ }
      <div
        className={ cn(
          "z-10 h-1.5 w-8 rounded-t-md transition-colors duration-300",
          highlighted ? "bg-yellow-500" : isCheckedIn ? "bg-blue-600" : isOccupied ? "bg-red-700" : "bg-emerald-700"
        ) }
      />

      { /* Seat Body */ }
      <div
        className={ cn(
          "flex w-full flex-1 flex-col overflow-hidden rounded-lg border shadow-sm transition-colors duration-300",
          isMoveTarget
            ? "border-emerald-500 bg-emerald-100/40"
            : highlighted
            ? "border-yellow-500 bg-yellow-100/50"
            : isCheckedIn
            ? "border-blue-500 bg-blue-100/50"
            : isOccupied
            ? "border-red-500 bg-red-300/30"
            : "border-emerald-500 bg-background/30"
        ) }
      >
        { /* Header (Seat No & Price) */ }
        <div
          className={ cn(
            "flex justify-between px-1 py-px text-[9px] font-bold text-white transition-colors duration-300",
            highlighted ? "bg-yellow-600" : isCheckedIn ? "bg-blue-600" : isOccupied ? "bg-red-600" : "bg-emerald-600"
          ) }
        >
          <span>{ seat.id < 0 ? "طفل" : "مقعد" } { Math.abs(seat.id) }</span>
          <span
            onMouseEnter={ () => onHoverData?.("amount", ticket?.amount.toString()) }
            onMouseLeave={ () => onHoverData?.(null) }
          >
            ${ ticket?.amount ?? "0" }
          </span>
        </div>

        { /* Content */ }
        { isOccupied
          ? (
            <div className="flex flex-col gap-px px-1 py-0.5 text-[8px] text-right leading-tight">
              <p className="truncate font-bold">{ ticket?.passenger?.name }</p>
              <p
                className="truncate opacity-80"
                onMouseEnter={ () => onHoverData?.("nationality", ticket?.passenger?.nationality?.name) }
                onMouseLeave={ () => onHoverData?.(null) }
              >
                { ticket?.passenger?.nationality?.name }
              </p>
              <div
                className={ cn(
                  "mt-px border-t pt-px text-[8px] font-semibold",
                  isCheckedIn ? "border-blue-200" : "border-red-200"
                ) }
              >
                <span
                  className="block truncate"
                  onMouseEnter={ () => onHoverData?.("from", ticket?.fromCityName) }
                  onMouseLeave={ () => onHoverData?.(null) }
                >
                  { ticket?.fromCityName }
                </span>
                <span className="block text-center text-[7px] opacity-40">إلى</span>
                <span
                  className="block truncate"
                  onMouseEnter={ () => onHoverData?.("to", ticket?.toCityName) }
                  onMouseLeave={ () => onHoverData?.(null) }
                >
                  { ticket?.toCityName }
                </span>
              </div>
            </div>
          )
          : (
            <div className="flex flex-1 flex-col items-center justify-center">
              <span
                className={ cn(
                  "text-[8px] font-bold",
                  isMoveTarget ? "text-emerald-700 animate-bounce" : "text-emerald-500"
                ) }
              >
                { isMoveTarget ? "هنا؟" : "متاح" }
              </span>
            </div>
          ) }
      </div>

      { /* Armrests */ }
      <div
        className={ cn(
          "absolute top-6 -left-0.5 h-5 w-1 rounded-full",
          isCheckedIn ? "bg-blue-300" : isOccupied ? "bg-red-300" : "bg-slate-300"
        ) }
      />
      <div
        className={ cn(
          "absolute top-6 -right-0.5 h-5 w-1 rounded-full",
          isCheckedIn ? "bg-blue-300" : isOccupied ? "bg-red-300" : "bg-slate-300"
        ) }
      />
    </button>
  );
}
