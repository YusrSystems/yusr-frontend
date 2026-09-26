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
					onSearch={ (text) =>
					{
						Cubits.taxes.search(
							text,
							(tax) => `${ tax.name } ${ tax.percentage }%`
						);
					} }
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
					<div className="flex items-center justify-between w-full">
						<span className="font-normal">{ tax.name }</span>
						<span className="text-xs text-muted-foreground font-mono">%{ tax.percentage }</span>
					</div>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}