import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import { Role, RoleDto } from "../../../entities";
import { BaseCubits } from "../../../services";
import { PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";

export function RolesSearchableSelect({ ...props }: SearchableSelectProps<Role<RoleDto>, RoleDto>)
{
  useSignals();

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ props.label } disabled={ props.disabled } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput onSearch={ (searchInput) => BaseCubits.roles.search(searchInput) } />
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
    if (BaseCubits.roles.state.value instanceof PageLoading)
    {
      return <SearchableSelect.Loading />;
    }

    if (BaseCubits.roles.state.value instanceof PageLoaded && BaseCubits.roles.entities.value.length > 0)
    {
      return BaseCubits.roles.entities.value.map((entity) => (
        <Option key={ entity.id.value } item={ entity } { ...props } />
      ));
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
