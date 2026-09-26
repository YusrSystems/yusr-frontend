import { createSimpleListResource } from "yusr-ui";
import { type CategoryDto } from "@/core/data/category";


export const categoriesApi = createSimpleListResource<CategoryDto>("Categories");