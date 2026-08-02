import type { FilterOperator } from "./filterOperator.ts";


export interface FilterOptionDto
{
	operator: FilterOperator;
	localizedName: string;
}