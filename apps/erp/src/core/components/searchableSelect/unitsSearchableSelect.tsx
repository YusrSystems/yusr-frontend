import type { UnitDto } from "@/core/data/unit";
import Unit from "@/core/data/unit";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { PageCubit, PageLoaded, PageLoading, SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "yusr-ui";

export default function UnitsSearchableSelect({ ...props }: SearchableSelectProps<Unit, UnitDto>)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<Unit, UnitDto>(Services.unitsApi), []);
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
          await Services.unitsApi.Add(Unit.create({ name: searchText }));
          cubit.init();
        } }
      />
    );
  }
}

const Option = React.memo(
  function Option(
    { cubit, ...props }: Omit<SearchableSelectOptionProps<Unit, UnitDto>, "labelSelector"> & {
      cubit: PageCubit<Unit, UnitDto>;
    }
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
            const result = await Services.unitsApi.Delete(props.item.id.value);
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
