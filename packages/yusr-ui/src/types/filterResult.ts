import { Dto } from "../stateManager";


export type FilterResult<TDto extends Dto> = {
	data: TDto[] | undefined;
	count: number;
};
