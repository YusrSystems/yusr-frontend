import { YusrApiHelper } from "yusr-ui";


const BASE_URL = `/api/ItemMetadataTemp`;

export const ItemMetadataTempService = {
	async getDistinctClasses(): Promise<string[]>
	{
		const result = await YusrApiHelper.Get<string[]>(`${ BASE_URL }/Classes`);
		return result.data ?? [];
	},

	async getDistinctBrands(): Promise<string[]>
	{
		const result = await YusrApiHelper.Get<string[]>(`${ BASE_URL }/Brands`);
		return result.data ?? [];
	}
};