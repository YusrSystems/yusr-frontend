import type { MultiSearchableSelectRootProps } from "yusr-ui";
import { MultiSearchableSelect, PageLoaded, PageLoading } from "yusr-ui";
import { ItemDto } from "@/core/data/item.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


export default function ItemsMultiSearchableSelect(
	props: MultiSearchableSelectRootProps<ItemDto>
)
{
	useSignals();

	return (
		<MultiSearchableSelect<ItemDto> labelSelector="name" { ...props }>
			<MultiSearchableSelect.Trigger disabled={ props.disabled }/>
			<MultiSearchableSelect.Content>
				<MultiSearchableSelect.SearchInput
					onSearch={ (text) => Cubits.items.search(text) }
				/>
				<MultiSearchableSelect.Command>
					<CommandItems/>
				</MultiSearchableSelect.Command>

				<MultiSearchableSelect.Footer/>
			</MultiSearchableSelect.Content>
		</MultiSearchableSelect>
	);

	function CommandItems()
	{
		useSignals();

		if (Cubits.items.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.items.state.value instanceof PageLoaded && Cubits.items.entities.value.length > 0)
		{
			return Cubits.items.entities.value.map((item) => (
				<MultiSearchableSelect.Option<ItemDto>
					key={ item.id }
					item={ item }
				>
					<MultiSearchableSelect.OptionBody label={ item.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}