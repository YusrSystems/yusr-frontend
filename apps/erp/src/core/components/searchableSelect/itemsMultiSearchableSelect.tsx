import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { ItemDto } from "@/core/data/item.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { Signal, signal } from "@preact/signals-react";


export default function ItemsMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<ItemDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), []);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), []);

	return (<MultiSearchableSelect<ItemDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.items.search(text) }
			/>
			<MultiSearchableSelect.Command>
				<CommandItems/>
			</MultiSearchableSelect.Command>

			<MultiSearchableSelect.Footer ids={ localIds } labels={ localLabels }/>
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
			return Cubits.items.entities.value.map((item) => (
				<MultiSearchableSelect.Option<ItemDto>
					{ ...props }
					key={ item.id }
					ids={ localIds }
					labels={ localLabels }
					labelSelector="name"
					item={ item }
				>
					<MultiSearchableSelect.OptionBody label={ item.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}