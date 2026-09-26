import { ChangeableEntityMode, type Dto } from "#/stateManager";


export interface CommonChangeDialogProps<TDto extends Dto>
{
	dto?: TDto;
	onSuccess?: (newData: TDto, mode: ChangeableEntityMode) => void;
}