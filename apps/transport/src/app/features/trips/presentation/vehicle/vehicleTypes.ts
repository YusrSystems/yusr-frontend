import type { Ticket } from "../data/ticket";

export interface SeatType
{
  id: number;
  price?: number;
}

export interface SeatProps
{
  seat: SeatType;
  ticket?: Ticket;
  onClick: (seat: SeatType) => void;
  highlighted?: boolean;
  isDimmed?: boolean;
  isMoveTarget?: boolean;
  onCheckInUpdate?: (ticketId: number) => void;
  onDeleteTicket?: (ticketId: number) => void;
  onMoveTicket?: (ticket: Ticket) => void;
  onHoverData?: (type: "nationality" | "from" | "to" | "amount" | null, value?: string) => void;
}

export interface VehicleProps
{
  seats: SeatType[];
  tickets: Ticket[];
  onSeatClick: (seat: SeatType) => void;
  onCheckInUpdate?: (ticketId: number) => void;
  onDeleteTicket?: (ticketId: number) => void;
  onMoveTicket?: (ticket: Ticket) => void;
  movingTicketId?: number | string;
  lastRowFull?: boolean;
  isLoading?: boolean;
}
