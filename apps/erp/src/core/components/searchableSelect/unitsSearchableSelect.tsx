import type { UnitDto } from "@/core/data/unit";
import Unit from "@/core/data/unit";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
  PageLoaded,
  PageLoading,
  SearchableSelect,
  type SearchableSelectOptionProps,
  type SearchableSelectProps
} from "yusr-ui";


export default function UnitsSearchableSelect({...props}: SearchableSelectProps<Unit, UnitDto>)
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
				<Option key={ entity.id.value } item={ entity } { ...props } />
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					await Services.unitsApi.Add(Unit.create({name: searchText}));
					Cubits.units.init();
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<Unit, UnitDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<Unit, UnitDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name.value }/>
				<SearchableSelect.DeleteOptionButton
					onDelete={ async () =>
					{
						const result = await Services.unitsApi.Delete(props.item.id.value);
						if (result.status === 200)
						{
							Cubits.units.delete(props.item);
						}
					} }
				/>
			</SearchableSelect.Option>
		);
	}
);
