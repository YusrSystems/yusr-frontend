import { Button } from "yusr-ui";
import { Baby, Plus, ShipWheel, XCircle } from "lucide-react";
import VehicleLoadingSkeleton from "./vehicleLoadingSkeleton";
import VehicleSeat from "./vehicleSeat";
import type { VehicleProps as VehicleProps, SeatType } from "./vehicleTypes";
import { useVehicleLogic } from "./useVehicleLogic";
import type { Ticket } from "../../data/ticket";

// قمنا بتوسيع الـ Props لتقبل chairsPerRow مع إعطائها قيمة افتراضية 4
interface ExtendedVehicleProps extends VehicleProps {
  chairsPerRow?: number;
}

export default function VehicleLayout({
  seats,
  tickets,
  onSeatClick,
  onCheckInUpdate,
  onDeleteTicket,
  onMoveTicket,
  movingTicketId,
  lastRowFull = false,
  isLoading = false,
  chairsPerRow = 4,
}: ExtendedVehicleProps) {
  if (isLoading) {
    return <VehicleLoadingSkeleton columns={10} showLogo={true} />;
  }

  const { ticketMap, babyTickets, nextBabyId, columns, hoverFilter, handleHover } = useVehicleLogic(seats, tickets, chairsPerRow);

  const getHighlightStatus = (ticket?: Ticket) => {
    if (movingTicketId !== undefined && movingTicketId !== null) {
      const isTheOneMoving = ticket && ticket.id === movingTicketId;
      return { isHighlighted: !!isTheOneMoving, isDimmed: !isTheOneMoving };
    }

    if (!hoverFilter) {
      return { isHighlighted: false, isDimmed: false };
    }
    if (!ticket) {
      return { isHighlighted: false, isDimmed: true };
    }

    const match =
      ticket.passenger?.nationality?.name === hoverFilter.value ||
      ticket.fromCityName === hoverFilter.value ||
      ticket.toCityName === hoverFilter.value ||
      ticket.amount?.toString() === hoverFilter.value;

    return { isHighlighted: match, isDimmed: !match };
  };

  const renderSeat = (seat: SeatType, ticket?: Ticket) => {
    const { isHighlighted, isDimmed } = getHighlightStatus(ticket);
    return (
      <VehicleSeat
        key={seat.id}
        seat={seat}
        ticket={ticket}
        onClick={onSeatClick}
        onCheckInUpdate={onCheckInUpdate}
        onDeleteTicket={onDeleteTicket}
        onMoveTicket={onMoveTicket}
        isMoveTarget={!!movingTicketId && !ticket}
        highlighted={isHighlighted}
        isDimmed={isDimmed}
        onHoverData={handleHover}
      />
    );
  };

  const topSeatsCount = Math.ceil(chairsPerRow / 2);

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex flex-col items-center justify-center min-w-min overflow-hidden p-10 bg-background gap-12">
        {/* Move Mode Indicator */}
        {movingTicketId && (
          <div className="flex items-center gap-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full animate-in slide-in-from-top-4">
            <span className="text-xs font-bold text-blue-700">وضع النقل مفعل: إختر مقعداً فارغاً</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onMoveTicket?.(null as any)}
            >
              <XCircle className="h-4 w-4 text-blue-700" />
            </Button>
          </div>
        )}

        {/* Vehicle Structure */}
        <div className="relative flex w-max min-w-130 flex-row rounded-[2.2rem] border-2 border-border bg-muted/30 p-4 shadow-xl">
          {/* Lights & Mirrors */}
          <div className="absolute -right-1 top-10 h-8 w-2 rounded-l-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
          <div className="absolute -right-1 bottom-10 h-8 w-2 rounded-l-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
          <div className="absolute -top-5 right-12 flex flex-col items-center">
            <div className="h-2 w-1 bg-gray-400" />
            <div className="h-4 w-6 rounded-t-sm bg-gray-800 dark:bg-gray-600 border border-gray-400" />
          </div>
          <div className="absolute -left-1 top-10 h-8 w-2 rounded-r-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
          <div className="absolute -left-1 bottom-10 h-8 w-2 rounded-r-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
          <div className="absolute -bottom-5 right-12 flex flex-col items-center">
            <div className="h-4 w-6 rounded-b-sm bg-gray-800 dark:bg-gray-600 border border-gray-400" />
            <div className="h-2 w-1 bg-gray-400" />
          </div>

          <div className="ml-4 flex flex-col items-center justify-end border-l border-dashed border-border pl-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-inner">
              <ShipWheel className="h-6 w-6" />
            </div>
            <span className="mt-1 text-[10px] font-semibold text-muted-foreground">السائق</span>
          </div>

          <div className="flex flex-row gap-3">
            {columns.map((colSeats, colIndex) => {
              const isLastColumn = colIndex === columns.length - 1;

              if (isLastColumn && lastRowFull) {
                return (
                  <div key={colIndex} className="flex flex-col justify-center gap-1 border-r border-border pr-1">
                    {colSeats.map((seat) => renderSeat(seat, ticketMap[seat.id]))}
                  </div>
                );
              }

              // الصفوف العادية (مفصولة بممر)
              return (
                <div key={colIndex} className="flex flex-col justify-between">
                  {/* الجزء العلوي من المقاعد */}
                  <div className="flex flex-col gap-1 mt-2 mb-2">
                    {colSeats.slice(0, topSeatsCount).map((seat) => renderSeat(seat, ticketMap[seat.id]))}
                  </div>


                  {/* الجزء السفلي من المقاعد */}
                  <div className="flex flex-col gap-1">
                    {colSeats.slice(topSeatsCount, chairsPerRow).map((seat) => renderSeat(seat, ticketMap[seat.id]))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wheels */}
          <div className="absolute -bottom-3 left-20 h-4 w-14 rounded-b-xl bg-neutral-900 dark:bg-gray-400" />
          <div className="absolute -bottom-3 right-24 h-4 w-14 rounded-b-xl bg-neutral-900 dark:bg-gray-400" />
          <div className="absolute -top-3 left-20 h-4 w-14 rounded-t-xl bg-neutral-900 dark:bg-gray-400" />
          <div className="absolute -top-3 right-24 h-4 w-14 rounded-t-xl bg-neutral-900 dark:bg-gray-400" />
        </div>

        {/* Baby Tickets Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Baby className="h-4 w-4" />
            <span className="text-xs font-bold">تذاكر الأطفال</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 p-6 rounded-2xl border-2 border-dashed border-border bg-muted/5 min-w-75">
            {babyTickets.map((ticket) => renderSeat({ id: ticket.chairNo }, ticket))}
            <div className="relative">
              {renderSeat({ id: nextBabyId }, undefined)}
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-emerald-600 bg-background">
                <Plus className="h-3 w-3 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}