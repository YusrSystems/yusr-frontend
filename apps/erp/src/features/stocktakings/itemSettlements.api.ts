import { apiClient, createCrudResource } from "yusr-ui";
import { type ItemsSettlementDto } from "@/core/data/itemsSettlement";


export const itemsSettlementsApi = {
	...createCrudResource<ItemsSettlementDto>("ItemSettlements"),

	addFromStocktaking: (stocktakingId: number, description?: string) =>
	{
		const query = new URLSearchParams({stocktakingId: stocktakingId.toString()});
		if (description)
		{
			query.set("description", description);
		}
		return apiClient.post<ItemsSettlementDto>(
			`/api/ItemSettlements/AddFromStocktaking?${ query.toString() }`,
			undefined,
			{successMessage: "تم إنشاء تسوية المواد من الجرد بنجاح"}
		);
	}
};