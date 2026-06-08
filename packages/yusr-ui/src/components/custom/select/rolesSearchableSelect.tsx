import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { Role, RoleDto } from "../../../entities";
import { BaseServices } from "../../../services/baseServices";
import { PageCubit, PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";

export function RolesSearchableSelect({ ...props }: SearchableSelectProps<Role<RoleDto>, RoleDto>)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<Role<RoleDto>, RoleDto>(BaseServices.rolesApi), []);
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
  function Option({ ...props }: Omit<SearchableSelectOptionProps<Role<RoleDto>, RoleDto>, "labelSelector">)
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
