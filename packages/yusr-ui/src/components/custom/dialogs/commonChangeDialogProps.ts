import type { BaseEntity } from "../../../entities";
import type { BaseApiService } from "../../../networking";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};
