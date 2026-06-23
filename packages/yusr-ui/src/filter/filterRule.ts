import { type Dto, Entity } from "../stateManager";
import { FilterOperator } from "./filterOperator.ts";
import type { Signal } from "@preact/signals-react";


export interface FilterRuleDto extends Dto
{
	field: string;
	operator: FilterOperator;
	value: string | number | boolean | (string | number)[] | undefined;
}

export class FilterRule extends Entity<FilterRuleDto>
{
	field: Signal<string> = this.assign("field", "");
	operator: Signal<FilterOperator> = this.assign("operator", FilterOperator.Equal);
	value: Signal<string | number | boolean | (string | number)[] | undefined> = this.assign("value", "");

	static create()
	{
		return new FilterRule();
	}
}

