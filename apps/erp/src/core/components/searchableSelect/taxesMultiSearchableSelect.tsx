import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { Signal, signal } from "@preact/signals-react";
import type { TaxDto } from "@/core/data/tax.ts";


export default function TaxesMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<TaxDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);

	return (<MultiSearchableSelect<TaxDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.taxes.search(text) }
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
		if (Cubits.taxes.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.taxes.state.value instanceof PageLoaded && Cubits.taxes.entities.value.length > 0)
		{
			return Cubits.taxes.entities.value.map((tax) => (
				<MultiSearchableSelect.Option<TaxDto>
					{ ...props }
					key={ tax.id }
					ids={ localIds }
					labels={ localLabels }
					labelSelector="name"
					item={ tax }
				>
					<MultiSearchableSelect.OptionBody label={ tax.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}