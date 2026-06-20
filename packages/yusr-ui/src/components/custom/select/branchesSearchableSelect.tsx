import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import { Branch, BranchDto } from "../../../entities";
import { BaseCubits } from "../../../services";
import { PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";


export function BranchesSearchableSelect({...props}: SearchableSelectProps<Branch, BranchDto>)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput onSearch={ (searchInput) => BaseCubits.branches.search(searchInput) }/>
				<SearchableSelect.Command>
					<SearchableSelect.NullOption { ...props } />
					<CommandItems/>
				</SearchableSelect.Command>
			</SearchableSelect.Content>
		</SearchableSelect>
	);

	function CommandItems()
	{
		useSignals();
		if (BaseCubits.branches.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (BaseCubits.branches.state.value instanceof PageLoaded && BaseCubits.branches.entities.value.length > 0)
		{
			return BaseCubits.branches.entities.value.map((entity) => (
				<Option key={ entity.id.value } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<Branch, BranchDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option<Branch, BranchDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name.value }/>
			</SearchableSelect.Option>
		);
	}
);
