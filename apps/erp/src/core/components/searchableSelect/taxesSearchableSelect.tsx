import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { PageCubit, PageLoaded, PageLoading, SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "yusr-ui";
import { Tax, TaxDto } from "../../data/tax";

export default function TaxesSearchableSelect({ ...props }: SearchableSelectProps<Tax, TaxDto>)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<Tax, TaxDto>(Services.taxesApi), []);
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
  function Option({ ...props }: Omit<SearchableSelectOptionProps<Tax, TaxDto>, "labelSelector">)
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
