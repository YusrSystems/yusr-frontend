import { apiClient, createSimpleListResource } from "yusr-ui";
import { type PosTerminalDto } from "@/core/data/posTerminal";


export const posTerminalsApi = {
	...createSimpleListResource<PosTerminalDto>("PosTerminals"),

	addFavorite: (terminalId: number, itemId: number, displayOrder: number = 0) =>
		apiClient.post<boolean>(`/api/PosTerminals/${ terminalId }/Favorites/Add?itemId=${ itemId }&displayOrder=${ displayOrder }`),

	removeFavorite: (terminalId: number, itemId: number) =>
		apiClient.delete<boolean>(`/api/PosTerminals/${ terminalId }/Favorites/${ itemId }`)
};