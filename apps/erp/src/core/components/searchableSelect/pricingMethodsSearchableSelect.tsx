import type { PricingMethodDto } from "@/core/data/pricingMethod";
import PricingMethod from "@/core/data/pricingMethod";
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


export default function PricingMethodsSearchableSelect(
	{...props}: SearchableSelectProps<PricingMethod, PricingMethodDto>
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
						Cubits.pricingMethods.search(searchInput);
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
		if (Cubits.pricingMethods.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (
			Cubits.pricingMethods.state.value instanceof PageLoaded
			&& Cubits.pricingMethods.entities.value.length > 0
		)
		{
			return Cubits.pricingMethods.entities.value.map((entity) => (
				<Option key={ entity.id.value } item={ entity } { ...props } />
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					await Services.pricingMethodsApi.Add(PricingMethod.create({name: searchText}));
					Cubits.pricingMethods.init();
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<PricingMethod, PricingMethodDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<PricingMethod, PricingMethodDto>
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
							Cubits.pricingMethods.delete(props.item);
						}
					} }
				/>
			</SearchableSelect.Option>
		);
	}
);
