import { type TFunction } from "i18next";
import type { BaseEntity } from "../entities/baseEntity";
import type { RequestResult } from "../types/requestResult";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseApiService<T extends BaseEntity> extends BaseFilterableApiService<T>
{
  private static t: TFunction<"common"> | null = null;

  public static init(t: TFunction<"common">)
  {
    this.t = t;
  }

  protected static getT(): TFunction<"common">
  {
    if (!this.t)
    {
      throw new Error("BaseApiService not initialized. Call BaseApiService.init(t) first.");
    }
    return this.t;
  }

  async Get(id: number): Promise<RequestResult<T>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/${id}`);
  }

  async Add(entity: T): Promise<RequestResult<T>>
  {
    const t = BaseApiService.getT();
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Add`,
      entity,
      undefined,
      t("api.saveSuccess")
    );
  }

  async Update(entity: T): Promise<RequestResult<T>>
  {
    const t = BaseApiService.getT();
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/Update`,
      entity,
      undefined,
      t("api.updateSuccess")
    );
  }

  async Delete(id: number)
  {
    const t = BaseApiService.getT();
    return await YusrApiHelper.Delete(
      `${ApiConstants.baseUrl}/${this.routeName}/${id}`,
      undefined,
      t("api.deleteSuccess")
    );
  }
}
