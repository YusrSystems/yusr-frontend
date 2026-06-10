import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import { PageLoaded, PageLoading, SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "yusr-ui";
import { Store, type StoreDto } from "../../data/store";

export default function StoresSearchableSelect({ ...props }: SearchableSelectProps<Store, StoreDto>)
{
  useSignals();

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ props.label } disabled={ props.disabled } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput
          onSearch={ (searchInput) =>
          {
            Cubits.stores.search(searchInput);
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
    if (Cubits.stores.state.value instanceof PageLoading)
    {
      return <SearchableSelect.Loading />;
    }

    if (Cubits.stores.state.value instanceof PageLoaded && Cubits.stores.entities.value.length > 0)
    {
      return Cubits.stores.entities.value.map((entity) => (
        <Option key={ entity.id.value } item={ entity } { ...props } />
      ));
    }

    return (
      <SearchableSelect.AddOptionButton
        onCreate={ async (searchText) =>
        {
          await Services.storesApi.Add(Store.create({ name: searchText }));
          Cubits.stores.init();
        } }
      />
    );
  }
}

const Option = React.memo(
  function Option(
    { ...props }: Omit<SearchableSelectOptionProps<Store, StoreDto>, "labelSelector">
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
              Cubits.stores.delete(props.item);
            }
          } }
        />
      </SearchableSelect.Option>
    );
  }
);
