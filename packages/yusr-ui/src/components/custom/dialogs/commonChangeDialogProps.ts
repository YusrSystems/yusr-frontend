import type { BaseEntity } from "../../../entities";
import type { BaseApiService, BaseApiServiceOld } from "../../../networking";
import type { Dto, ValidatableEntity } from "../../../stateManager";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogPropsOld<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiServiceOld<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};

export type CommonChangeDialogProps<TEntity extends ValidatableEntity<TDto>, TDto extends Dto> = {
  entity: TEntity;
  service: BaseApiService<TEntity, TDto>;
  onSuccess?: (newData: TEntity) => void;
};
