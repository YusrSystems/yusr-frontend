import TaxesApiService from "@/core/networking/taxesApiService";
import { Cubit } from "yusr-ui";
import { TaxesEmpty, TaxesInitialState, TaxesLoaded, TaxesLoading } from "./taxesState";

export class TaxesCubit extends Cubit<TaxesInitialState>
{
  constructor()
  {
    super(new TaxesInitialState());
  }

  async getUserData()
  {
    this.emit(new TaxesLoading());
    const taxesApiService = new TaxesApiService();
    await taxesApiService.Filter(1, 100);

    if (taxesApiService.Data.value.length === 0)
    {
      this.emit(new TaxesEmpty());
      return;
    }
    this.emit(new TaxesLoaded(taxesApiService.Data.value));
  }
}
