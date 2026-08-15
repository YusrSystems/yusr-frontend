import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services.ts";
import { CategoryDto } from "@/core/data/category.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo, useState } from "react";
import { signal } from "@preact/signals-react";
import { Dialog, SearchableSelect, type SearchableSelectProps } from "yusr-ui";
import ChangeCategoryDialog from "./changeCategoryDialog";
import { CategoriesSearchableCommandItems } from "./components/categoriesSearchableCommandItems";


export default function CategoriesSearchableSelect({
	...props
}: SearchableSelectProps<CategoryDto>)
{
	useSignals();
	const [searchText, setSearchText] = useState("");
	const [expanded, setExpanded] = useState<number[]>([]);

	const isAddOpen = useMemo(() => signal(false), []);
	const newSearchText = useMemo(() => signal(""), []);
	const editingCategory = useMemo(() => signal<CategoryDto | undefined>(undefined), []);

	const toggleExpand = (id: number) =>
	{
		setExpanded(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
	};

	const handleOpenAdd = (text: string) =>
	{
		Cubits.categories.search("");
		newSearchText.value = text ?? "";
		isAddOpen.value = true;
	};

	const handleOpenEdit = (category: CategoryDto) =>
	{
		Cubits.categories.search("");
		editingCategory.value = category;
	};

	const handleDelete = async (category: CategoryDto) =>
	{
		const res = await Services.categoriesApi.Delete(category.id);
		if (res.status === 200)
		{
			Cubits.categories.delete(category);
			if (props.id?.value === category.id)
			{
				props.id.value = undefined;
				if (props.label) props.label.value = "";
			}
		}
	};

	return (
		<>
			<SearchableSelect>
				<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
				<SearchableSelect.Content>
					<SearchableSelect.SearchInput
						onSearch={ (text) =>
						{
							setSearchText(text ?? "");
							Cubits.categories.search(text);
						} }
					/>
					<SearchableSelect.Command>
						<SearchableSelect.NullOption { ...props } />
						<CategoriesSearchableCommandItems
							searchText={ searchText }
							expanded={ expanded }
							onToggleExpand={ toggleExpand }
							onOpenAdd={ handleOpenAdd }
							onOpenEdit={ handleOpenEdit }
							onDelete={ handleDelete }
							{ ...props }
						/>
					</SearchableSelect.Command>
				</SearchableSelect.Content>
			</SearchableSelect>

			{ isAddOpen.value && (
				<Dialog open={ isAddOpen.value } onOpenChange={ (open) => (isAddOpen.value = open) }>
					<ChangeCategoryDialog
						initDto={ {name: newSearchText.value} }
						service={ Services.categoriesApi }
						onSuccess={ (data) =>
						{
							Cubits.categories.add(data);
							if (props.id) props.id.value = data.id;
							if (props.label) props.label.value = data.name;
							if (props.onSelect) props.onSelect(data);
							isAddOpen.value = false;
						} }
					/>
				</Dialog>
			) }

			{ editingCategory.value && (
				<Dialog
					open={ editingCategory.value !== undefined }
					onOpenChange={ (open) =>
					{
						if (!open) editingCategory.value = undefined;
					} }
				>
					<ChangeCategoryDialog
						dto={ editingCategory.value }
						service={ Services.categoriesApi }
						onSuccess={ (data) =>
						{
							Cubits.categories.update(data);
							if (props.id?.value === data.id && props.label)
							{
								props.label.value = data.name;
							}
							editingCategory.value = undefined;
						} }
					/>
				</Dialog>
			) }
		</>
	);
}