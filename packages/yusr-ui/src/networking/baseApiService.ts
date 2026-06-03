import { type TFunction } from "i18next";
import type { Dto, Entity } from "../stateManager";
import type { RequestResult } from "../types/requestResult";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseApiService<TEntity extends Entity<TDto>, TDto extends Dto>
  extends BaseFilterableApiService<TEntity, TDto>
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

  async Get(id: number): Promise<RequestResult<TEntity>>
  {
    const rawResult = await YusrApiHelper.Get<TDto>(`${ApiConstants.baseUrl}/${this.routeName}/${id}`);
    return {
      ...rawResult,
      data: rawResult.data ? this.createEntity(rawResult.data) : undefined
    };
  }

  async Add(entity: TEntity): Promise<RequestResult<TEntity>>
  {
    const t = BaseApiService.getT();
    const rawResult = await YusrApiHelper.Post<TDto>(
      `${ApiConstants.baseUrl}/${this.routeName}/Add`,
      entity.toJson(),
      undefined,
      t("api.saveSuccess")
    );

    return {
      ...rawResult,
      data: rawResult.data ? this.createEntity(rawResult.data) : undefined
    };
  }

  async Update(entity: TEntity): Promise<RequestResult<TEntity>>
  {
    const t = BaseApiService.getT();
    const rawResult = await YusrApiHelper.Put<TDto>(
      `${ApiConstants.baseUrl}/${this.routeName}/Update`,
      entity.toJson(),
      undefined,
      t("api.updateSuccess")
    );

    return {
      ...rawResult,
      data: rawResult.data ? this.createEntity(rawResult.data) : undefined
    };
  }

  async Delete(id: number)
  {
    const t = BaseApiService.getT();
    const result = await YusrApiHelper.Delete(
      `${ApiConstants.baseUrl}/${this.routeName}/${id}`,
      undefined,
      t("api.deleteSuccess")
    );

    return result;
  }
}
