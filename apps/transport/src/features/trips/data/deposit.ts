import type { StorageFile } from "@/app/core/data/storageFile";
import { BaseEntity } from "@yusr_systems/core";

export class Deposit extends BaseEntity
{
  public tripId!: number;
  public fromCityId!: number;
  public toCityId!: number;
  public sender!: string;
  public recipient!: string;
  public senderPhone!: string;
  public recipientPhone!: string;
  public description!: string;
  public amount!: number;
  public paidAmount?: number;
  public notes?: string;
  public image?: StorageFile;

  public fromCityName!: string;
  public toCityName!: string;

  constructor(init?: Partial<Deposit>)
  {
    super();
    Object.assign(this, init);
  }
}
