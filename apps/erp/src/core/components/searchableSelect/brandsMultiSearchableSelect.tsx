import { Button, MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo, useState } from "react";
import { Signal, signal } from "@preact/signals-react";
import { BrandDto } from "@/core/data/brand.ts";
import { Plus } from "lucide-react";


export default function BrandsMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<BrandDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);
	const [searchText, setSearchText] = useState("");

	return (<MultiSearchableSelect<BrandDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) =>
				{
					setSearchText(text ?? "");
					Cubits.brands.search(text);
				} }
			/>
			<MultiSearchableSelect.Command>
				<CommandItems searchText={ searchText }/>
			</MultiSearchableSelect.Command>

			<MultiSearchableSelect.Footer ids={ localIds } labels={ localLabels }/>
		</MultiSearchableSelect.Content>
	</MultiSearchableSelect>);

	function CommandItems({searchText}: { searchText: string })
	{
		useSignals();
		if (Cubits.brands.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.brands.state.value instanceof PageLoaded)
		{
			const hasExactMatch = Cubits.brands.entities.value.some(c => c.name.toLowerCase() === searchText.toLowerCase());

			return (
				<>
					{ Cubits.brands.entities.value.map((brand) => (
						<MultiSearchableSelect.Option<BrandDto>
							{ ...props }
							key={ brand.id }
							ids={ localIds }
							labels={ localLabels }
							labelSelector="name"
							item={ brand }
						>
							<MultiSearchableSelect.OptionBody label={ brand.name }/>
						</MultiSearchableSelect.Option>
					)) }
					{ searchText && !hasExactMatch && (
						<div className="p-1">
							<Button
								type="button"
								variant="ghost"
								className="w-full justify-start text-sm h-8 px-2"
								onClick={ async () =>
								{
									const res = await Services.brandsApi.Add({name: searchText} as BrandDto);
									if (res.data)
									{
										Cubits.brands.init();
										localIds.value = [...localIds.value, res.data.id];
										localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
										setSearchText("");
										Cubits.brands.search("");
									}
								} }
							>
								<Plus className="h-4 w-4 me-2"/> إضافة "{ searchText }"
							</Button>
						</div>
					) }
					{ Cubits.brands.entities.value.length === 0 && !searchText && <MultiSearchableSelect.Empty/> }
				</>
			);
		}

		return <MultiSearchableSelect.Empty/>;
	}
}