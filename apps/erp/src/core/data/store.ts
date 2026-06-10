import type { Signal } from "@preact/signals-react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type TFunction } from "i18next";
import { BaseEntity, ChangeableEntity, type ChangeableEntityMode, Dto, i18n, type IEntityState, type ValidationRule, type ValidationRuleOld, Validators } from "yusr-ui";
import StoresApiServiceOld from "../networking/storesApiServiceOld";

export default class StoreOld extends BaseEntity
{
  public name!: string;
  public createdBy!: number;
  public authorized!: boolean;

  constructor(init?: Partial<StoreOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class StoreDto extends Dto
{
  public name!: string;
  public authorized!: boolean;
}

export class Store extends ChangeableEntity<StoreDto>
{
  declare name: Signal<string>;
  declare authorized: Signal<boolean>;

  protected initialValue(dto?: Partial<StoreDto> | undefined): StoreDto
  {
    return {
      id: 0,
      name: "",
      authorized: true,
      ...dto
    };
  }

  constructor(dto: StoreDto, mode: ChangeableEntityMode = "create")
  {
    const rules: ValidationRule<Partial<StoreDto>>[] = [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("stocking:stores.nameRequired"))]
    }];

    super(dto, rules, mode);
  }
}

export class StoreValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<StoreOld>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("stores.nameRequired"))]
  }];
}

export const storeService = new StoresApiServiceOld();

export const filterAll = createAsyncThunk(
  "store/filterAll",
  async (searchText: string | undefined, { getState }) =>
  {
    const state = (getState() as never)["store"] as IEntityState<StoreOld>;
    const result = await storeService.FilterAll(state.currentPage, state.rowsPerPage, searchText);
    return result?.data;
  }
);
