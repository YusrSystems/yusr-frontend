import type { MultiSearchableSelectRootProps } from "yusr-ui";
import { MultiSearchableSelect, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import type { TaxDto } from "@/core/data/tax.ts";


export default function TaxesMultiSearchableSelect(
	props: MultiSearchableSelectRootProps<TaxDto>
)
{
	useSignals();

	return (
		<MultiSearchableSelect<TaxDto> labelSelector="name" { ...props }>
			<MultiSearchableSelect.Trigger disabled={ props.disabled }/>
			<MultiSearchableSelect.Content>
				<MultiSearchableSelect.SearchInput
					onSearch={ (text) => Cubits.taxes.search(text) }
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

		if (Cubits.taxes.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.taxes.state.value instanceof PageLoaded && Cubits.taxes.entities.value.length > 0)
		{
			return Cubits.taxes.entities.value.map((tax) => (
				<MultiSearchableSelect.Option<TaxDto>
					key={ tax.id }
					item={ tax }
				>
					<MultiSearchableSelect.OptionBody label={ tax.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}