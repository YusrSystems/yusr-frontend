import type { BaseApiService } from "../../../networking";
import type { Dto, ValidatableEntity } from "../../../stateManager";


export type CommonChangeDialogProps<TEntity extends ValidatableEntity<TDto>, TDto extends Dto> = {
	entity: TEntity;
	service: BaseApiService<TEntity, TDto>;
	onSuccess?: (newData: TEntity) => void;
};
