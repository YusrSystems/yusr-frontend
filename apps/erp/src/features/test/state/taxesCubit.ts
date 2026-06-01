import TaxesApiService from "@/core/networking/taxesApiService";
import { Cubit } from "yusr-ui";
import { TaxesInitialState, TaxesLoaded, TaxesLoading } from "./taxesState";

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

    this.emit(new TaxesLoaded(taxesApiService.Data.value));
  }
}
