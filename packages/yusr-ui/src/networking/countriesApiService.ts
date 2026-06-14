import { Country, type CountryDto } from "../entities/country";
import { BaseFilterableApiService } from "./baseFilterableApiService";

export class CountriesApiService extends BaseFilterableApiService<Country, CountryDto>
{
  routeName: string = "Countries";

  createEntity(dto: CountryDto): Country
  {
    return new Country(dto);
  }
}
