import type { BaseEntity } from "@yusr_systems/core";
import type { BaseApiService } from "@yusr_systems/core";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};
