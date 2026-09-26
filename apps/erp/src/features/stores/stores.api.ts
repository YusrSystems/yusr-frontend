import { createSimpleListResource } from "yusr-ui";
import { type StoreDto } from "@/core/data/store";


export const storesApi = createSimpleListResource<StoreDto>("Stores");