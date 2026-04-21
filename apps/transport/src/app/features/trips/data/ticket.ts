import { BaseEntity, User } from "yusr-core";
import type { Passenger } from "../../passengers/data/passenger";

export class Ticket extends BaseEntity
{
  public tripId!: number;
  public passengerId!: number;
  public fromCityId!: number;
  public toCityId!: number;
  public amount!: number;
  public paidAmount?: number;
  public issueDate?: Date;
  public issueCityId!: number;
  public chairNo!: number;
  public notes!: string;
  public fromCityName?: string;
  public toCityName?: string;
  public issueCityName?: string;
  public createdById!: number;
  public printedById?: number;
  public checkedIn!: boolean;
  public accessKey!: string;

  public passenger?: Passenger;
  public createdBy?: User;
  public printedBy?: User;

  constructor(init?: Partial<Ticket>)
  {
    super();
    Object.assign(this, init);
  }
}
