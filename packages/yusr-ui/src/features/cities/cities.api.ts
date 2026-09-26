import { CityDto } from "#/entities";
import { createReadOnlyListResource } from "#/api/createReadOnlyListResource.ts";


export const citiesApi = createReadOnlyListResource<CityDto>("Cities");