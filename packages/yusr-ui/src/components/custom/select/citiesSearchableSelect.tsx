import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import { CityDto } from "../../../entities";
import { BaseCubits } from "../../../services";
import { PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";


export function CitiesSearchableSelect({...props}: SearchableSelectProps<CityDto>)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput onSearch={ (searchInput) => BaseCubits.cities.search(searchInput) }/>
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
		if (BaseCubits.cities.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (BaseCubits.cities.state.value instanceof PageLoaded && BaseCubits.cities.entities.value.length > 0)
		{
			return BaseCubits.cities.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<CityDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option<CityDto>
				labelSelector="name"
				{ ...props }
			>
				<div className="flex flex-col flex-1 truncate min-w-0">
					<span className="truncate text-sm">{ props.item.name }</span>
					<span className="truncate text-xs text-muted-foreground">{ props.item.country.name }</span>
				</div>
			</SearchableSelect.Option>
		);
	}
);
