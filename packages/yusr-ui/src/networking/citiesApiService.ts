import { City, type CityDto } from "../entities";
import { BaseFilterableApiService } from "./baseFilterableApiService";

export class CitiesApiService extends BaseFilterableApiService<City, CityDto>
{
  routeName: string = "Cities";
  createEntity(dto: CityDto): City
  {
    return new City(dto);
  }
}
