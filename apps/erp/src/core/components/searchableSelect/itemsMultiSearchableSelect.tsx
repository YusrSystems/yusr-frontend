import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { ItemDto } from "@/core/data/item.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";


export default function ItemsMultiSearchableSelect(
	{...props}: Omit<MultiSearchableSelectProps<ItemDto>, "ids" | "labels">
)
{
	useSignals();

	const labels = useMemo(() => signal<Record<number, string>>([]), []);
	const ids = useMemo(() => signal<number[]>([]), []);

	return (<MultiSearchableSelect<ItemDto>>
		<MultiSearchableSelect.Trigger
			labels={ labels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.items.search(text) }
			/>
			<MultiSearchableSelect.Command>
				<CommandItems/>
			</MultiSearchableSelect.Command>

			<MultiSearchableSelect.Footer ids={ ids } labels={ labels }/>
		</MultiSearchableSelect.Content>
	</MultiSearchableSelect>);

	function CommandItems()
	{
		useSignals();
		if (Cubits.items.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.items.state.value instanceof PageLoaded && Cubits.items.entities.value.length > 0)
		{
			return Cubits.items.state.value instanceof PageLoaded && Cubits.items.entities.value.map((item) => (
				<MultiSearchableSelect.Option<ItemDto>
					key={ item.id }
					ids={ ids }
					labels={ labels }
					labelSelector="name"
					item={ item }
					{ ...props }
				>
					<MultiSearchableSelect.OptionBody label={ item.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}