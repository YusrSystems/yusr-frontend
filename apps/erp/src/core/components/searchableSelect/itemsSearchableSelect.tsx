import type Item from "@/core/data/item";
import { type ItemDto, ItemType } from "@/core/data/item";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
  cn,
  PageLoaded,
  PageLoading,
  SearchableSelect,
  type SearchableSelectOptionProps,
  type SearchableSelectProps
} from "yusr-ui";


export default function ItemsSearchableSelect(
	{...props}: SearchableSelectProps<Item, ItemDto>
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
						Cubits.items.search(searchInput);
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
		if (Cubits.items.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.items.state.value instanceof PageLoaded && Cubits.items.entities.value.length > 0)
		{
			return Cubits.items.entities.value.map((entity) => (
				<Option key={ entity.id.value } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<Item, ItemDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<Item, ItemDto>
				labelSelector="name"
				{ ...props }
			>
				<div className="flex items-center gap-3 py-0.5 w-full">
					<div className="flex-1 min-w-0">
						<span className="text-sm font-medium truncate">{ props.item.name }</span>
					</div>

					{ props.item.type.value === ItemType.Product && (
						<div className="flex flex-col items-end gap-1 shrink-0">
              <span
				  className={ cn(
					  "text-xs font-medium px-1.5 py-0.5 rounded",
					  props.item.storeQuantity.value <= 0
						  ? "bg-destructive/10 text-destructive"
						  : props.item.storeQuantity <= (props.item.minQuantity ?? 10)
							  ? "bg-yellow-500/10 text-yellow-600"
							  : "bg-green-500/10 text-green-600"
				  ) }
			  >
                { props.item.storeQuantity } { props.item.sellUnitName }
              </span>
						</div>
					) }
				</div>
			</SearchableSelect.Option>
		);
	}
);
