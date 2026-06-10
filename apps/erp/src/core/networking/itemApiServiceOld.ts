import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, FilterByTypeRequest, type RequestResult, YusrApiHelper } from "yusr-ui";
import ItemOld, { BarcodeResultOld } from "../data/itemOld";

export default class ItemsApiServiceOld extends BaseApiServiceOld<ItemOld>
{
  routeName: string = "Items";

  async FilterStoreItems(
    pageNumber: number,
    rowsPerPage: number,
    storeId: number | undefined,
    request: FilterByTypeRequest<ItemOld>
  ): Promise<RequestResult<ApiFilterResult<ItemOld>>>
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
  ): Promise<RequestResult<BarcodeResultOld>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/GetByBarcode/${barcode}/${storeId}`);
  }
}
