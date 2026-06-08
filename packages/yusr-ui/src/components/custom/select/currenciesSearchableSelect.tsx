import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { Currency, CurrencyDto, CurrencyOld } from "../../../entities";
import { BaseServices } from "../../../services/baseServices";
import { PageCubit, PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";

export function CurrenciesSearchableSelect({ ...props }: SearchableSelectProps<Currency, CurrencyDto>)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<Currency, CurrencyOld>(BaseServices.currenciesApi), []);
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
  function Option({ ...props }: Omit<SearchableSelectOptionProps<Currency, CurrencyOld>, "labelSelector">)
  {
    useSignals();
    return (
      <SearchableSelect.Option
        labelSelector="name"
        { ...props }
      >
        <SearchableSelect.OptionBody label={ props.item.name.value } />
      </SearchableSelect.Option>
    );
  }
);
