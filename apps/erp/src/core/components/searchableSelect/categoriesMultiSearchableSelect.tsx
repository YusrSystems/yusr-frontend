import { Button, MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo, useState } from "react";
import { Signal, signal } from "@preact/signals-react";
import { CategoryDto } from "@/core/data/category.ts";
import { Plus } from "lucide-react";


export default function CategoriesMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<CategoryDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);
	const [searchText, setSearchText] = useState("");

	return (<MultiSearchableSelect<CategoryDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) =>
				{
					setSearchText(text ?? "");
					Cubits.categories.search(text);
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
		if (Cubits.categories.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.categories.state.value instanceof PageLoaded)
		{
			const hasExactMatch = Cubits.categories.entities.value.some(c => c.name.toLowerCase() === searchText.toLowerCase());

			return (
				<>
					{ Cubits.categories.entities.value.map((category) => (
						<MultiSearchableSelect.Option<CategoryDto>
							{ ...props }
							key={ category.id }
							ids={ localIds }
							labels={ localLabels }
							labelSelector="name"
							item={ category }
						>
							<MultiSearchableSelect.OptionBody label={ category.name }/>
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
									const res = await Services.categoriesApi.Add({name: searchText} as CategoryDto);
									if (res.data)
									{
										Cubits.categories.init();
										localIds.value = [...localIds.value, res.data.id];
										localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
										setSearchText("");
										Cubits.categories.search("");
									}
								} }
							>
								<Plus className="h-4 w-4 me-2"/> إضافة "{ searchText }"
							</Button>
						</div>
					) }
					{ Cubits.categories.entities.value.length === 0 && !searchText && <MultiSearchableSelect.Empty/> }
				</>
			);
		}

		return <MultiSearchableSelect.Empty/>;
	}
}