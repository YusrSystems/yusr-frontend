import { ApiConstants, BaseApiService, FilterByTypeRequest, type FilterResult, type RequestResult, YusrApiHelper } from "yusr-ui";
import Item, { BarcodeResult } from "../data/item";

export default class ItemsApiService extends BaseApiService<Item>
{
  routeName: string = "Items";

  async FilterStoreItems(
    pageNumber: number,
    rowsPerPage: number,
    storeId: number | undefined,
    request: FilterByTypeRequest<Item>
  ): Promise<RequestResult<FilterResult<Item>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterStoreItems?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&${
        storeId == undefined ? "" : `storeId=${storeId}`
      }`,
      request
    );
  }

  async GetByBarcode(
    barcode: string,
    storeId: number
  ): Promise<RequestResult<BarcodeResult>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/GetByBarcode/${barcode}/${storeId}`);
  }
}
