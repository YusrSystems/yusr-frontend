import type { BaseApiService } from "../../../networking";
import { ChangeableEntityMode, type Dto } from "../../../stateManager";


export type CommonChangeDialogProps<TDto extends Dto> = {
	dto?: TDto;
	service: BaseApiService<TDto>;
	onSuccess?: (newData: TDto, mode: ChangeableEntityMode) => void;
};
