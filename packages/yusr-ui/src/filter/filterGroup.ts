import { type Dto, Entity } from "../stateManager";
import { FilterRule, type FilterRuleDto } from "../filter";
import type { Signal } from "@preact/signals-react";


export interface FilterGroupDto extends Dto
{
	rules: FilterRuleDto[];
}

export class FilterGroup extends Entity<FilterGroupDto>
{
	rules: Signal<FilterRule[]> = this.assign("rules", [FilterRule.create()]);

	static create()
	{
		return new FilterGroup();
	}
}