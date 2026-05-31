import type { BaseEntity } from "../../../entities";
import type { BaseApiServiceOld } from "../../../networking";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiServiceOld<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};
