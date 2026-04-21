import type { Currency } from "yusr-core";
import type { StorageFile } from "./storageFile";

export class Tenant
{
  public email!: string;
  public name!: string;
  public registrationKey!: string;
  public phone!: string;
  public logo?: StorageFile;
  public currency!: Currency;

  constructor(init?: Partial<Tenant>)
  {
    Object.assign(this, init);
  }
}
