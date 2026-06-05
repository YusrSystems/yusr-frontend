import { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { City, CityDto } from "../../../entities";
import { BaseServices } from "../../../services/baseServices";
import { PageCubit, PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect } from "./searchableSelect";

export function CitiesSearchableSelect(
  { id, label }: { id: Signal<number | undefined>; label: Signal<string | undefined>; }
)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<City, CityDto>(BaseServices.citiesApi, 100), []);
  useEffect(() => cubit.init(), []);

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ label.value } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput onSearch={ (searchInput) => cubit.search(searchInput) } />
        <SearchableSelect.Command>
          <SearchableSelect.NullOption id={ id } label={ label } />
          <CommandItems />
        </SearchableSelect.Command>
      </SearchableSelect.Content>
    </SearchableSelect>
  );

  function CommandItems()
  {
    if (cubit.state.value instanceof PageLoading)
    {
      return <SearchableSelect.Loading />;
    }

    if (cubit.state.value instanceof PageLoaded && cubit.entities.value.length > 0)
    {
      return cubit.entities.value.map((city) => (
        <CityOption key={ city.id.value } city={ city } id={ id } label={ label } />
      ));
    }

    return <SearchableSelect.Empty />;
  }
}

const CityOption = React.memo(function CityOption(
  { city, id, label }: { city: City; id: Signal<number | undefined>; label: Signal<string | undefined>; }
)
{
  useSignals();
  return (
    <SearchableSelect.Option<City, CityDto>
      id={ id }
      label={ label }
      labelSelector="name"
      item={ city }
    >
      <div className="flex flex-col flex-1 truncate min-w-0">
        <span className="truncate text-sm">{ city.name.value }</span>
        <span className="truncate text-xs text-muted-foreground">{ city.country.value.name }</span>
      </div>
    </SearchableSelect.Option>
  );
});
