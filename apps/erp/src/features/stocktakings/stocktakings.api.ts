import { StocktakingDto } from "@/core/data/stocktaking";
import { apiClient, createCrudResource } from "#/api";


export const stocktakingsApi = createCrudResource<StocktakingDto>("Stocktakings");

export const itemsSettlementsApi = {
	...createCrudResource<StocktakingDto>("ItemSettlements"),
	addFromStocktaking: (stocktakingId: number, description?: string) =>
		apiClient.post<StocktakingDto>(
			`/api/ItemSettlements/AddFromStocktaking?stocktakingId=${ stocktakingId }${ description ? `&description=${ encodeURIComponent(description) }` : "" }`,
			undefined,
			{successMessage: "تم إنشاء تسوية المواد من الجرد بنجاح"}
		)
};