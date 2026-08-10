import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services.ts";
import { CategoryDto } from "@/core/data/category.ts";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";


export default function CategoriesSearchableSelect(
	{...props}: SearchableSelectProps<CategoryDto>
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
						Cubits.categories.search(searchInput);
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
		if (Cubits.categories.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.length > 0)
		{
			return Cubits.categories.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					const res = await Services.categoriesApi.Add({name: searchText} as CategoryDto);
					if (res.data)
					{
						Cubits.categories.init();
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
		{...props}: Omit<SearchableSelectOptionProps<CategoryDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<CategoryDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
			</SearchableSelect.Option>
		);
	}
);