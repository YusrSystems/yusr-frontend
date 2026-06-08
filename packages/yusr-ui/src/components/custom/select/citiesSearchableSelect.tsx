import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { City, CityDto } from "../../../entities";
import { BaseServices } from "../../../services/baseServices";
import { PageCubit, PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";

export function CitiesSearchableSelect({ ...props }: SearchableSelectProps<City, CityDto>)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<City, CityDto>(BaseServices.citiesApi), []);
  useEffect(() => cubit.init(), []);

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ props.label?.value } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput onSearch={ (searchInput) => cubit.search(searchInput) } />
        <SearchableSelect.Command>
          <SearchableSelect.NullOption { ...props } />
          <CommandItems />
        </SearchableSelect.Command>
      </SearchableSelect.Content>
    </SearchableSelect>
  );

  function CommandItems()
  {
    useSignals();
    if (cubit.state.value instanceof PageLoading)
    {
      return <SearchableSelect.Loading />;
    }

    if (cubit.state.value instanceof PageLoaded && cubit.entities.value.length > 0)
    {
      return cubit.entities.value.map((entity) => <Option key={ entity.id.value } item={ entity } { ...props } />);
    }

    return <SearchableSelect.Empty />;
  }
}

const Option = React.memo(
  function Option({ ...props }: Omit<SearchableSelectOptionProps<City, CityDto>, "labelSelector">)
  {
    useSignals();
    return (
      <SearchableSelect.Option<City, CityDto>
        labelSelector="name"
        { ...props }
      >
        <div className="flex flex-col flex-1 truncate min-w-0">
          <span className="truncate text-sm">{ props.item.name.value }</span>
          <span className="truncate text-xs text-muted-foreground">{ props.item.country.value.name }</span>
        </div>
      </SearchableSelect.Option>
    );
  }
);
