import type { Store, StoreDto } from "@/core/data/store";
import { Services } from "@/core/services/services";
import { PageCubit, PageEmpty, PageLoaded, PageLoading } from "yusr-ui";

export class StoreCubit extends PageCubit<Store, StoreDto>
{
  private async filterAll()
  {
    this.emit(new PageLoading());

    const result = await Services.storesApi.FilterAll(
      this.currentPage.value,
      this.pageSize.value,
      this.searchText.value
    );

    if (!result.data?.length)
    {
      this.entities.value = [];
      this.count.value = 0;
      this.emit(new PageEmpty());
      return;
    }

    this.entities.value = result.data;
    this.count.value = result.count ?? 0;
    this.emit(new PageLoaded());
  }

  initFilterAll()
  {
    this.searchText.value = undefined;
    this.currentPage.value = 1;
    this.filterAll();
  }

  constructor()
  {
    super(Services.storesApi);
  }
}
