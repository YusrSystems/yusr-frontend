import { StoreDto } from "@/core/data/store";
import { createSimpleListResource } from "#/api";


export const storesApi = createSimpleListResource<StoreDto>("Stores");