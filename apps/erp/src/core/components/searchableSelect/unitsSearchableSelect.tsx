import type { UnitDto } from "@/core/data/unit";
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
import { unitsApi } from "@/features/units/units.api";


export default function UnitsSearchableSelect({...props}: SearchableSelectProps<UnitDto>)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) =>
					{
						Cubits.units.search(searchInput);
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
		if (Cubits.units.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.units.state.value instanceof PageLoaded && Cubits.units.entities.value.length > 0)
		{
			return Cubits.units.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					if (!searchText) return;
					const res = await unitsApi.add({name: searchText} as UnitDto);
					if (res.ok && res.data)
					{
						Cubits.units.add(res.data);
					}
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<UnitDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<UnitDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
				<SearchableSelect.DeleteOptionButton
					onDelete={ async () =>
					{
						const result = await unitsApi.delete(props.item.id);
						if (result.ok)
						{
							Cubits.units.delete(props.item);
						}
					} }
				/>
			</SearchableSelect.Option>
		);
	}
);