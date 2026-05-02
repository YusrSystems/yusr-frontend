import { BaseEntity, type ColumnName, Country } from "yusr-core";

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

  public get displayLabel()
  {
    return `${this.name} - ${this.passportNo}`;
  }

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
  public static columnsNames: ColumnName<Passenger>[] = [
    { label: "اسم الراكب", value: "name" },
    { label: "رقم الجوال", value: "phoneNumber" },
    { label: "رقم جواز السفر", value: "passportNo" },
    { label: "رقم الراكب", value: "id" }
  ];
}
