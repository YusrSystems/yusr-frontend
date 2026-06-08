import { Services } from "@/core/services/services";
import { StoreCubit } from "@/features/stores/state/storeCubit";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { PageLoaded, PageLoading, SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "yusr-ui";
import { Store, type StoreDto } from "../../data/store";

export default function StoresSearchableSelect({ ...props }: SearchableSelectProps<Store, StoreDto>)
{
  useSignals();
  const cubit = useMemo(() => new StoreCubit(), []);
  useEffect(() => cubit.init(), []);

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ props.label?.value } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput
          onSearch={ (searchInput) =>
          {
            cubit.search(searchInput);
          } }
        />
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
      return cubit.entities.value.map((entity) => (
        <Option cubit={ cubit } key={ entity.id.value } item={ entity } { ...props } />
      ));
    }

    return (
      <SearchableSelect.AddOptionButton
        onCreate={ async (searchText) =>
        {
          await Services.storesApi.Add(Store.create({ name: searchText }));
          cubit.init();
        } }
      />
    );
  }
}

const Option = React.memo(
  function Option(
    { cubit, ...props }: Omit<SearchableSelectOptionProps<Store, StoreDto>, "labelSelector"> & { cubit: StoreCubit; }
  )
  {
    useSignals();
    return (
      <SearchableSelect.Option
        labelSelector="name"
        { ...props }
      >
        <SearchableSelect.OptionBody label={ props.item.name.value } />
        <SearchableSelect.DeleteOptionButton
          onDelete={ async () =>
          {
            const result = await Services.storesApi.Delete(props.item.id.value);
            if (result.status === 200)
            {
              cubit.delete(props.item);
            }
          } }
        />
      </SearchableSelect.Option>
    );
  }
);
