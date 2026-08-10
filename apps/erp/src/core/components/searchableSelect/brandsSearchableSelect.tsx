import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services.ts";
import { BrandDto } from "@/core/data/brand.ts";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";


export default function BrandsSearchableSelect(
	{...props}: SearchableSelectProps<BrandDto>
)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) =>
					{
						Cubits.brands.search(searchInput);
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
		if (Cubits.brands.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.brands.state.value instanceof PageLoaded && Cubits.brands.entities.value.length > 0)
		{
			return Cubits.brands.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					const res = await Services.brandsApi.Add({name: searchText} as BrandDto);
					if (res.data)
					{
						Cubits.brands.init();
						if (props.id) props.id.value = res.data.id;
						if (props.label) props.label.value = res.data.name;
						if (props.onSelect) props.onSelect(res.data);
					}
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<BrandDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<BrandDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
			</SearchableSelect.Option>
		);
	}
);