import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { TaxDto } from "../../data/tax";


export default function TaxesSearchableSelect({...props}: SearchableSelectProps<TaxDto>)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) =>
					{
						Cubits.taxes.search(
							searchInput,
							(tax) => `${ tax.name } ${ tax.percentage }%`
						);
					} }
				/>
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
		if (Cubits.taxes.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.taxes.state.value instanceof PageLoaded && Cubits.taxes.entities.value.length > 0)
		{
			return Cubits.taxes.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<TaxDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option<TaxDto>
				labelSelector="name"
				{ ...props }
			>
				<div className="flex items-center justify-between w-full">
					<span className="font-normal">{ props.item.name }</span>
					<span className="text-xs text-muted-foreground font-mono">%{ props.item.percentage }</span>
				</div>
			</SearchableSelect.Option>
		);
	}
);