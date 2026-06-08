import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import UnitsApiServiceOld from "../networking/unitApiServiceOld";

export default class UnitOld extends BaseEntity
{
  public name!: string;

  constructor(init?: Partial<UnitOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class UnitValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<UnitOld>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("units.nameRequired"))]
  }];
}

export class UnitSlice
{
  private static entitySliceInstance = createGenericEntitySlice("unit", new UnitsApiServiceOld());
  public static entityActions = UnitSlice.entitySliceInstance.actions;
  public static entityReducer = UnitSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<UnitOld>("unitDialog");
  public static dialogActions = UnitSlice.dialogSliceInstance.actions;
  public static dialogReducer = UnitSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<UnitOld>("unitForm");
  public static formActions = UnitSlice.formSliceInstance.actions;
  public static formReducer = UnitSlice.formSliceInstance.reducer;
}
