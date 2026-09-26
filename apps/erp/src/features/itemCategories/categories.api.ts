import { CategoryDto } from "@/core/data/category";
import { createSimpleListResource } from "#/api";


export const categoriesApi = createSimpleListResource<CategoryDto>("Categories");