import { BrandDto } from "@/core/data/brand";
import { createSimpleListResource } from "#/api";


export const brandsApi = createSimpleListResource<BrandDto>("Brands");