import { ApiConstants, type ApiFilterResult, BaseApiService, FilterByTypeRequest, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { BarcodeResult, ItemDto } from "../data/item";
import Item from "../data/item";

export default class ItemsApiService extends BaseApiService<Item, ItemDto>
{
  routeName: string = "Items";
  override createEntity(dto: ItemDto): Item
  {
    return new Item(dto);
  }

  async FilterStoreItems(
    pageNumber: number,
    rowsPerPage: number,
    storeId: number | undefined,
    request: FilterByTypeRequest
  ): Promise<RequestResult<ApiFilterResult<Item>>>
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
