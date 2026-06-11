import type { PaymentMethod, PaymentMethodDto } from "@/features/paymentMethods/data/paymentMethod";
import { StoresCubit } from "@/features/stores/state/storeCubit";
import { BaseCubits, PageCubit } from "yusr-ui";
import type { ErpRole, ErpRoleDto } from "../data/erpRole";
import type Item from "../data/item";
import type { ItemDto } from "../data/item";
import type PricingMethod from "../data/pricingMethod";
import type { PricingMethodDto } from "../data/pricingMethod";
import type { Tax, TaxDto } from "../data/tax";
import type Unit from "../data/unit";
import type { UnitDto } from "../data/unit";
import { Services } from "./services";

export class Cubits extends BaseCubits
{
  public static readonly taxes = new PageCubit<Tax, TaxDto>(Services.taxesApi);
  public static readonly stores = new StoresCubit();
  public static readonly units = new PageCubit<Unit, UnitDto>(Services.unitsApi);
  public static readonly pricingMethods = new PageCubit<PricingMethod, PricingMethodDto>(Services.pricingMethodsApi);
  public static readonly paymentMethods = new PageCubit<PaymentMethod, PaymentMethodDto>(Services.paymentMethodsApi);
  public static readonly items = new PageCubit<Item, ItemDto>(Services.itemsApi);
  public static override roles = new PageCubit<ErpRole, ErpRoleDto>(Services.rolesApi);

  static
  {
    BaseCubits.roles = Cubits.roles;
  }
}
