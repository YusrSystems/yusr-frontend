import type { Tax, TaxDto } from "@/core/data/tax";
import { Services } from "@/core/services/services";
import { PageCubit } from "yusr-ui";
import { TaxesEmpty, TaxesInitialState, TaxesLoaded, TaxesLoading } from "./taxesState";

export class TaxesCubit extends PageCubit<TaxesInitialState, Tax, TaxDto>
{
  constructor()
  {
    super(new TaxesInitialState(), Services.taxesApi, 1);
  }

  protected loadingState()
  {
    return new TaxesLoading();
  }
  protected loadedState()
  {
    return new TaxesLoaded();
  }
  protected emptyState()
  {
    return new TaxesEmpty();
  }
}
