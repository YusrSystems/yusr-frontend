import { Dialog, MultiSearchableSelect, type MultiSearchableSelectRootProps } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { effect, signal } from "@preact/signals-react";
import { CategoryDto } from "@/core/data/category.ts";
import ChangeCategoryDialog from "./changeCategoryDialog";
import { CategoriesMultiCommandItems } from "./components/categoriesMultiCommandItems";


export default function CategoriesMultiSearchableSelect(
	props: MultiSearchableSelectRootProps<CategoryDto>
)
{
	useSignals();

	const [searchText, setSearchText] = useState("");
	const [expanded, setExpanded] = useState<number[]>([]);

	const isDialogOpen = useMemo(() => signal(false), []);
	const newSearchText = useMemo(() => signal(""), []);
	const editingCategory = useMemo(() => signal<CategoryDto | undefined>(undefined), []);

	const prevIds = useRef<number[]>(props.ids?.value ?? []);

	useEffect(() =>
	{
		if (!props.ids || !props.labels) return;

		return effect(() =>
		{
			const currentIds = props.ids!.value;
			const added = currentIds.filter(id => !prevIds.current.includes(id));

			if (added.length > 0)
			{
				queueMicrotask(() =>
				{
					const latestIds = props.ids!.value;
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
							else if (props.labels!.value[id])
							{
								newLabels[id] = props.labels!.value[id];
							}
						}

						prevIds.current = idsToKeep;
						props.ids!.value = idsToKeep;
						props.labels!.value = newLabels;
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
	}, [props.ids, props.labels]);

	const toggleExpand = (id: number) =>
	{
		setExpanded(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
	};

	const handleOpenAdd = (text: string) =>
	{
		Cubits.categories.search("");
		setSearchText("");
		newSearchText.value = text ?? "";
		isDialogOpen.value = true;
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
			if (props.ids?.value.includes(category.id))
			{
				props.ids.value = props.ids.value.filter(id => id !== category.id);
				if (props.labels?.value)
				{
					const newLabels = {...props.labels.value};
					delete newLabels[category.id];
					props.labels.value = newLabels;
				}
			}
		}
	};

	return (
		<>
			<MultiSearchableSelect<CategoryDto> labelSelector="name" { ...props }>
				<MultiSearchableSelect.Trigger disabled={ props.disabled }/>
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
							ids={ props.ids }
							searchText={ searchText }
							expanded={ expanded }
							onToggleExpand={ toggleExpand }
							onOpenAdd={ handleOpenAdd }
							onOpenEdit={ handleOpenEdit }
							onDelete={ handleDelete }
						/>
					</MultiSearchableSelect.Command>

					<MultiSearchableSelect.Footer/>
				</MultiSearchableSelect.Content>
			</MultiSearchableSelect>

			{ isDialogOpen.value && (
				<Dialog open={ isDialogOpen.value } onOpenChange={ (open) => (isDialogOpen.value = open) }>
					<ChangeCategoryDialog
						initDto={ {name: newSearchText.value} }
						service={ Services.categoriesApi }
						onSuccess={ (data) =>
						{
							Cubits.categories.add(data);
							if (props.ids)
							{
								props.ids.value = [...props.ids.value, data.id];
							}
							if (props.labels)
							{
								props.labels.value = {...props.labels.value, [data.id]: data.name};
							}
							setSearchText("");
							Cubits.categories.search("");
							isDialogOpen.value = false;
						} }
					/>
				</Dialog>
			) }

			{ editingCategory.value && (
				<Dialog
					open={ true }
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
							if (props.ids?.value.includes(data.id) && props.labels?.value)
							{
								props.labels.value = {...props.labels.value, [data.id]: data.name};
							}
							editingCategory.value = undefined;
						} }
					/>
				</Dialog>
			) }
		</>
	);
}