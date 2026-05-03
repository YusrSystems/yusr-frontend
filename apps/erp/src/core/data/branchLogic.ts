import { Branch, BranchesApiService, type ValidationRule, Validators } from "yusr-ui";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "yusr-ui";

export class BranchValidationRules
{
  public static validationRules: ValidationRule<Partial<Branch>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required("اسم الفرع مطلوب")]
  }, {
    field: "cityId",
    selector: (d) => d.cityId,
    validators: [Validators.required("يرجى اختيار المدينة")]
  }, {
    field: "buildingNumber",
    selector: (d) => d.buildingNumber,
    validators: [Validators.optional(
      Validators.exactLength(4, "رقم المبنى يجب أن يتكون من أربع أرقام"),
      Validators.numeric()
    )]
  }, {
    field: "postalCode",
    selector: (d) => d.postalCode,
    validators: [Validators.optional(
      Validators.exactLength(5, "الرمز البريدي يجب أن يتكون من خمس أرقام"),
      Validators.numeric()
    )]
  }];
}

export class BranchSlice
{
  private static entitySliceInstance = createGenericEntitySlice("branch", new BranchesApiService());
  public static entityActions = BranchSlice.entitySliceInstance.actions;
  public static entityReducer = BranchSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Branch>("branchDialog");
  public static dialogActions = BranchSlice.dialogSliceInstance.actions;
  public static dialogReducer = BranchSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Branch>("branchForm");
  public static formActions = BranchSlice.formSliceInstance.actions;
  public static formReducer = BranchSlice.formSliceInstance.reducer;
}
