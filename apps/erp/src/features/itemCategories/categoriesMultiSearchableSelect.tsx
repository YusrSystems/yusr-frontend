import { Dialog, MultiSearchableSelect, type MultiSearchableSelectProps } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { effect, signal, type Signal } from "@preact/signals-react";
import { CategoryDto } from "@/core/data/category.ts";
import ChangeCategoryDialog from "./changeCategoryDialog";
import { CategoriesMultiCommandItems } from "./components/categoriesMultiCommandItems";


export default function CategoriesMultiSearchableSelect({
	ids,
	labels,
	...props
}: Omit<MultiSearchableSelectProps<CategoryDto>, "ids"> & {
	ids?: Signal<number[]>;
})
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);
	const [searchText, setSearchText] = useState("");
	const [expanded, setExpanded] = useState<number[]>([]);

	const isAddOpen = useMemo(() => signal(false), []);
	const newSearchText = useMemo(() => signal(""), []);
	const editingCategory = useMemo(() => signal<CategoryDto | undefined>(undefined), []);

	const prevIds = useRef<number[]>(localIds.value);

	useEffect(() =>
	{
		return effect(() =>
		{
			const currentIds = localIds.value;
			const added = currentIds.filter(id => !prevIds.current.includes(id));

			if (added.length > 0)
			{
				queueMicrotask(() =>
				{
					const latestIds = localIds.value;
					const newlyAdded = latestIds.filter(id => !prevIds.current.includes(id));

					if (newlyAdded.length === 0) return;

					let idsToKeep = [...latestIds];
					let changed = false;

					for (const addedId of newlyAdded)
					{
						const category = Cubits.categories.entities.value.find(c => c.id === addedId);
						if (!category) continue;

						if (category.parentCategoryId)
						{
							const parentId = category.parentCategoryId;
							const siblings = Cubits.categories.entities.value.filter(c => c.parentCategoryId === parentId);
							const siblingIds = siblings.map(c => c.id);

							if (prevIds.current.includes(parentId))
							{
								// Parent was checked, user clicked a child to uncheck it
								idsToKeep = idsToKeep.filter(id => id !== parentId && id !== addedId);
								for (const sib of siblings)
								{
									if (sib.id !== addedId && !idsToKeep.includes(sib.id))
									{
										idsToKeep.push(sib.id);
									}
								}
								changed = true;
							}
							else
							{
								// Normal child addition
								const allSiblingsSelected = siblingIds.every(id => idsToKeep.includes(id));
								if (allSiblingsSelected && siblingIds.length > 0)
								{
									idsToKeep = idsToKeep.filter(id => !siblingIds.includes(id));
									if (!idsToKeep.includes(parentId))
									{
										idsToKeep.push(parentId);
									}
									changed = true;
								}
							}
						}
						else
						{
							// Parent added -> remove children
							const childrenIds = Cubits.categories.entities.value
								.filter(c => c.parentCategoryId === category.id)
								.map(c => c.id);

							const childrenToRemove = idsToKeep.filter(id => childrenIds.includes(id));
							if (childrenToRemove.length > 0)
							{
								idsToKeep = idsToKeep.filter(id => !childrenIds.includes(id));
								changed = true;
							}
						}
					}

					if (changed)
					{
						const newLabels: Record<number, string> = {};
						for (const id of idsToKeep)
						{
							const cat = Cubits.categories.entities.value.find(c => c.id === id);
							if (cat)
							{
								newLabels[id] = cat.name;
							}
							else if (localLabels.value[id])
							{
								newLabels[id] = localLabels.value[id];
							}
						}

						prevIds.current = idsToKeep;
						localIds.value = idsToKeep;
						localLabels.value = newLabels;
					}
					else
					{
						prevIds.current = latestIds;
					}
				});
				return;
			}

			prevIds.current = currentIds;
		});
	}, [localIds, localLabels]);

	const toggleExpand = (id: number) =>
	{
		setExpanded(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
	};

	const handleOpenAdd = (text: string) =>
	{
		Cubits.categories.search("");
		setSearchText("");
		newSearchText.value = text ?? "";
		isAddOpen.value = true;
	};

	const handleOpenEdit = (category: CategoryDto) =>
	{
		Cubits.categories.search("");
		setSearchText("");
		editingCategory.value = category;
	};

	const handleDelete = async (category: CategoryDto) =>
	{
		const res = await Services.categoriesApi.Delete(category.id);
		if (res.status === 200)
		{
			Cubits.categories.delete(category);
			if (localIds.value.includes(category.id))
			{
				localIds.value = localIds.value.filter(id => id !== category.id);
				const newLabels = {...localLabels.value};
				delete newLabels[category.id];
				localLabels.value = newLabels;
			}
		}
	};

	return (
		<>
			<MultiSearchableSelect<CategoryDto>>
				<MultiSearchableSelect.Trigger labels={ localLabels } disabled={ props.disabled }/>
				<MultiSearchableSelect.Content>
					<MultiSearchableSelect.SearchInput
						onSearch={ (text) =>
						{
							setSearchText(text ?? "");
							Cubits.categories.search(text);
						} }
					/>
					<MultiSearchableSelect.Command>
						<CategoriesMultiCommandItems
							localIds={ localIds }
							localLabels={ localLabels }
							searchText={ searchText }
							expanded={ expanded }
							onToggleExpand={ toggleExpand }
							onOpenAdd={ handleOpenAdd }
							onOpenEdit={ handleOpenEdit }
							onDelete={ handleDelete }
							{ ...props }
						/>
					</MultiSearchableSelect.Command>

					<MultiSearchableSelect.Footer ids={ localIds } labels={ localLabels }/>
				</MultiSearchableSelect.Content>
			</MultiSearchableSelect>

			{ isAddOpen.value && (
				<Dialog open={ isAddOpen.value } onOpenChange={ (open) => (isAddOpen.value = open) }>
					<ChangeCategoryDialog
						initDto={ {name: newSearchText.value} }
						service={ Services.categoriesApi }
						onSuccess={ (data) =>
						{
							Cubits.categories.add(data);
							localIds.value = [...localIds.value, data.id];
							localLabels.value = {...localLabels.value, [data.id]: data.name};
							setSearchText("");
							Cubits.categories.search("");
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
							if (localIds.value.includes(data.id))
							{
								localLabels.value = {...localLabels.value, [data.id]: data.name};
							}
							editingCategory.value = undefined;
						} }
					/>
				</Dialog>
			) }
		</>
	);
}