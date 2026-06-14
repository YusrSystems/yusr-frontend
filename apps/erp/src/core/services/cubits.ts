import type { BalanceTransfer, BalanceTransferDto } from "@/features/balanceTransfer/data/balanceTransfer";
import { ItemsCubit } from "@/features/items/state/itemsCubit";
import type { PaymentMethod, PaymentMethodDto } from "@/features/paymentMethods/data/paymentMethod";
import { StoresCubit } from "@/features/stores/state/storeCubit";
import { BaseCubits, PageCubit } from "yusr-ui";
import type { Account, AccountDto } from "../data/account";
import type { ErpRole, ErpRoleDto } from "../data/erpRole";
import type ItemTransfer from "../data/itemTransfer";
import type { ItemTransferDto } from "../data/itemTransfer";
import type PricingMethod from "../data/pricingMethod";
import type { PricingMethodDto } from "../data/pricingMethod";
import type Stocktaking from "../data/stocktaking";
import type { StocktakingDto } from "../data/stocktaking";
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
  public static readonly accounts = new PageCubit<Account, AccountDto>(Services.accountsApi);
  public static readonly balanceTransfers = new PageCubit<BalanceTransfer, BalanceTransferDto>(
    Services.balanceTransfersApi
  );
  public static readonly items = new ItemsCubit();
  public static readonly stocktaking = new PageCubit<Stocktaking, StocktakingDto>(Services.stocktakingApi);
  public static readonly itemTransfers = new PageCubit<ItemTransfer, ItemTransferDto>(Services.itemTransfersApi);
  public static readonly itemsSettlements = new PageCubit<Stocktaking, StocktakingDto>(Services.itemsSettlementsApi);
  public static override roles = new PageCubit<ErpRole, ErpRoleDto>(Services.rolesApi);

  static
  {
    BaseCubits.roles = Cubits.roles;
  }
}
