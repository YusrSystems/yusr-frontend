import { Services } from "@/services";
import { PAGE_SIZE } from "@/systemConstants";
import { Cubit } from "yusr-ui";
import { TaxesEmpty, TaxesInitialState, TaxesLoaded, TaxesLoading } from "./taxesState";

export class TaxesCubit extends Cubit<TaxesInitialState>
{
  constructor()
  {
    super(new TaxesInitialState());
  }

  async Filter(pageNumber?: number, searchText?: string)
  {
    this.emit(new TaxesLoading());
    const taxesApiService = Services.taxesApi;
    await taxesApiService.Filter(pageNumber ?? 1, PAGE_SIZE, searchText);

    if (taxesApiService.Data.value.length === 0)
    {
      this.emit(new TaxesEmpty());
      return;
    }
    this.emit(new TaxesLoaded(taxesApiService.Data.value, taxesApiService.Count.value));
  }
}
