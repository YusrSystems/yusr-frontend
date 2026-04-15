import { Country } from "@/app/core/data/country";
import { BaseEntity, type ColumnName } from "@yusr_systems/core";

export class Passenger extends BaseEntity
{
  public name!: string;
  public passportNo!: string;
  public phoneNumber?: string;
  public gender!: Gender;
  public nationalityId?: number;
  public dateOfBirth?: Date;
  public passportExpiration?: Date;
  public passportIssueLocation?: string;
  public email?: string;

  public nationality?: Country;

  constructor(init?: Partial<Passenger>)
  {
    super();
    Object.assign(this, init);
  }
}

export type Gender = 0 | 1;

export const GENDER = { Male: 0 as Gender, Female: 1 as Gender } as const;

export class PassengerFilterColumns
{
  public static columnsNames: ColumnName[] = [
    { label: "اسم الراكب", value: "Name" },
    { label: "رقم الجوال", value: "PhoneNumber" },
    { label: "رقم جواز السفر", value: "PassportNo" },
    { label: "رقم الراكب", value: "Id" }
  ];
}
