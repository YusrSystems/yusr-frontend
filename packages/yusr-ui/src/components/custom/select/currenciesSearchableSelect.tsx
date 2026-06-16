import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import { Currency, CurrencyDto } from "../../../entities";
import { BaseCubits } from "../../../services";
import { PageLoaded, PageLoading } from "../../../stateManager";
import { SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "./searchableSelect";


export function CurrenciesSearchableSelect({...props}: SearchableSelectProps<Currency, CurrencyDto>)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput onSearch={ (searchInput) => BaseCubits.currencies.search(searchInput) }/>
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
		if (BaseCubits.currencies.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (BaseCubits.currencies.state.value instanceof PageLoaded && BaseCubits.currencies.entities.value.length > 0)
		{
			return BaseCubits.currencies.entities.value.map((entity) => (
				<Option key={ entity.id.value } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<Currency, CurrencyDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name.value }/>
			</SearchableSelect.Option>
		);
	}
);
