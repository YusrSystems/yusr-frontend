import type { BaseEntity } from "../entities/baseEntity";
import type { RequestResult } from "../types/requestResult";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseApiService<T extends BaseEntity> extends BaseFilterableApiService<T>
{
  async Get(id: number): Promise<RequestResult<T>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/${id}`);
  }

  async Add(entity: T): Promise<RequestResult<T>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Add`,
      entity,
      undefined,
      "تم حفظ البيانات بنجاح"
    );
  }

  async Update(entity: T): Promise<RequestResult<T>>
  {
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/Update`,
      entity,
      undefined,
      "تم تحديث المعلومات بنجاح"
    );
  }

  async Delete(id: number)
  {
    return await YusrApiHelper.Delete(
      `${ApiConstants.baseUrl}/${this.routeName}/${id}`,
      undefined,
      "تمت إزالة السجل بنجاح"
    );
  }
}
