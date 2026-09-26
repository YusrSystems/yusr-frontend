import { createSimpleListResource } from "yusr-ui";
import { type BrandDto } from "@/core/data/brand";


export const brandsApi = createSimpleListResource<BrandDto>("Brands");