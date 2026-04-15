import type { BaseEntity } from "yusr-core";
import type { BaseApiService } from "yusr-core";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};
