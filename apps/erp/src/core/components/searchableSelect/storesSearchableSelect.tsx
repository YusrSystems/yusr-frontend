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
import { StoreDto } from "../../data/store";
import { storesApi } from "@/features/stores/stores.api";


export default function StoresSearchableSelect({...props}: SearchableSelectProps<StoreDto>)
{
	useSignals();
	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) =>
					{
						Cubits.stores.search(searchInput);
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
		if (Cubits.stores.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}
		if (Cubits.stores.state.value instanceof PageLoaded && Cubits.stores.entities.value.length > 0)
		{
			return Cubits.stores.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}
		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					if (!searchText) return;
					const res = await storesApi.add({name: searchText} as StoreDto);
					if (res.ok && res.data)
					{
						Cubits.stores.add(res.data);
					}
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<StoreDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<StoreDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
				<SearchableSelect.DeleteOptionButton
					onDelete={ async () =>
					{
						const result = await storesApi.delete(props.item.id);
						if (result.ok)
						{
							Cubits.stores.delete(props.item);
						}
					} }
				/>
			</SearchableSelect.Option>
		);
	}
);