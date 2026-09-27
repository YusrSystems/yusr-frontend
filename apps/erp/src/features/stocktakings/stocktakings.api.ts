import { StocktakingDto } from "@/core/data/stocktaking";
import { apiClient, createCrudResource } from "#/api";


export const stocktakingsApi = createCrudResource<StocktakingDto>("Stocktakings");

export const itemsSettlementsApi = {
	...createCrudResource<StocktakingDto>("ItemSettlements"),
	addFromStocktaking: (stocktakingId: number, description?: string) =>
	{
		const query = new URLSearchParams({stocktakingId: stocktakingId.toString()});
		if (description)
		{
			query.set("description", description);
		}
		return apiClient.post<StocktakingDto>(
			`/api/ItemSettlements/AddFromStocktaking?${ query.toString() }`,
			undefined,
			{successMessage: "تم إنشاء تسوية المواد بنجاح"}
		);
	}
};