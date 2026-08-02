import type { FilterFieldType } from "./filterFieldType.ts";
import type { FilterOptionDto } from "./filterOptionDto.ts";


export interface FilterFieldMetadataDto
{
	propertyName: string;
	localizedName: string;
	type: FilterFieldType;
	filterOperators: FilterOptionDto[];
}