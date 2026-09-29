import { StocktakingDto } from "@/core/data/stocktaking";
import { createCrudResource } from "#/api";


export const stocktakingsApi = createCrudResource<StocktakingDto>("Stocktakings");