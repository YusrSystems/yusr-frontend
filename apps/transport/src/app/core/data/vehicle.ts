import { BaseEntity, type ColumnName, StorageFile } from "yusr-core";
import { createGenericDialogSlice, createGenericEntitySlice } from "yusr-ui";
import VehiclesApiService from "./vehiclesApiService";

export default class Vehicle extends BaseEntity
{
  public name!: string;
  public make?: string;
  public model?: string;
  public chairsNumber!: number;
  public chairsNumberPerRow!: number;
  public files: StorageFile[] = [];

  constructor(init?: Partial<Vehicle>)
  {
    super();
    Object.assign(this, init);
  }
}

export class VehicleFilterColumns
{
  public static columnsNames: ColumnName[] = [
    { label: "رقم المركبة", value: "Id" },
    { label: "اسم المركبة", value: "Name" },
    { label: "الشركة المصنعة", value: "Make" },
    { label: "الموديل", value: "Model" }
  ];
}

export class VehicleSlice
{
  private static entitySliceInstance = createGenericEntitySlice("vehicle", new VehiclesApiService());

  public static entityActions = VehicleSlice.entitySliceInstance.actions;
  public static entityReducer = VehicleSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Vehicle>("vehicleDialog");

  public static dialogActions = VehicleSlice.dialogSliceInstance.actions;
  public static dialogReducer = VehicleSlice.dialogSliceInstance.reducer;
}
