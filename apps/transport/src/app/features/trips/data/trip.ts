import type Vehicle from "@/app/core/data/vehicle";
import { BaseEntity, type ColumnName } from "yusr-ui";
import type { Route } from "../../routes/data/route";
import type { Deposit } from "./deposit";
import type { Ticket } from "./ticket";

export class Trip extends BaseEntity
{
  public mainCaptainName!: string;
  public secondaryCaptainName?: string;
  public busName?: string;
  public routeId!: number;
  public branchId!: number;
  public vehicleId!: number; // Add vehicleId
  public startDate!: Date;
  public ticketPrice!: number;
  public route!: Route;
  public vehicle!: Vehicle; // Add vehicle
  public tickets!: Ticket[];
  public deposits!: Deposit[];

  constructor(init?: Partial<Trip>)
  {
    super();
    Object.assign(this, init);
  }
}

export class TripFilterColumns
{
  public static columnsNames: ColumnName<Trip>[] = [
    { label: "رقم الرحلة", value: "id" },
    { label: "اسم القائد", value: "mainCaptainName" },
    { label: "اسم المساعد", value: "secondaryCaptainName" },
    { label: "المركبة", value: "busName" }
  ];
}
