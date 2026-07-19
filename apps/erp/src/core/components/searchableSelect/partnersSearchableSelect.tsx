import { type PartnerDto } from "@/core/data/partner";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";


export default function PartnersSearchableSelect({...props}: SearchableSelectProps<PartnerDto>)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput onSearch={ (searchInput) => Cubits.partners.search(searchInput) }/>
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
		if (Cubits.partners.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}
		if (Cubits.partners.state.value instanceof PageLoaded)
		{
			if (Cubits.partners.entities.value.length === 0)
			{
				return <SearchableSelect.Empty/>;
			}

			return Cubits.partners.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<PartnerDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option<PartnerDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
			</SearchableSelect.Option>
		);
	}
);