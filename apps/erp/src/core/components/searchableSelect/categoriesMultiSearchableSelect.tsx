import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	MultiSearchableSelect,
	type MultiSearchableSelectProps,
	PageLoaded,
	PageLoading,
	SelectField,
	TextField
} from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { effect, signal, Signal } from "@preact/signals-react";
import { CategoryDto } from "@/core/data/category.ts";
import { Check, ChevronDown, ChevronLeft, Edit2, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function CategoriesMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<CategoryDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();
	const {i18n} = useTranslation();
	const isRtl = i18n.dir() === "rtl";

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);
	const [searchText, setSearchText] = useState("");
	const [expanded, setExpanded] = useState<number[]>([]);

	const isDialogOpen = useMemo(() => signal(false), []);
	const editingCategory = useMemo(() => signal<CategoryDto | undefined>(undefined), []);
	const categoryName = useMemo(() => signal(""), []);
	const categoryParentId = useMemo(() => signal<number>(0), []);
	const isSaving = useMemo(() => signal(false), []);

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
		setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
	};

	const parentOptions = useMemo(() =>
	{
		return [
			{label: "بدون تصنيف أب", value: 0},
			...Cubits.categories.entities.value
				.filter(c => !c.parentCategoryId && c.id !== editingCategory.value?.id)
				.map(c => ({
					label: c.name,
					value: c.id
				}))
		];
	}, [Cubits.categories.entities.value, editingCategory.value]);

	const handleOpenAdd = (text: string) =>
	{
		Cubits.categories.search("");
		setSearchText("");
		editingCategory.value = undefined;
		categoryName.value = text ?? "";
		categoryParentId.value = 0;
		isDialogOpen.value = true;
	};

	const handleOpenEdit = (category: CategoryDto) =>
	{
		Cubits.categories.search("");
		setSearchText("");
		editingCategory.value = category;
		categoryName.value = category.name;
		categoryParentId.value = category.parentCategoryId ?? 0;
		isDialogOpen.value = true;
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

	const handleSave = async () =>
	{
		isSaving.value = true;
		try
		{
			if (editingCategory.value)
			{
				const res = await Services.categoriesApi.Update({
					...editingCategory.value,
					name: categoryName.value,
					parentCategoryId: categoryParentId.value === 0 ? undefined : categoryParentId.value
				});
				if (res.data)
				{
					Cubits.categories.update(res.data);
					if (localIds.value.includes(res.data.id))
					{
						localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
					}
					isDialogOpen.value = false;
				}
			}
			else
			{
				const res = await Services.categoriesApi.Add({
					name: categoryName.value,
					parentCategoryId: categoryParentId.value === 0 ? undefined : categoryParentId.value
				} as CategoryDto);
				if (res.data)
				{
					Cubits.categories.add(res.data);
					localIds.value = [...localIds.value, res.data.id];
					localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
					setSearchText("");
					Cubits.categories.search("");
					isDialogOpen.value = false;
				}
			}
		}
		finally
		{
			isSaving.value = false;
		}
	};

	return (
		<>
			<MultiSearchableSelect<CategoryDto>>
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
			</MultiSearchableSelect>

			<Dialog open={ isDialogOpen.value } onOpenChange={ (open) => isDialogOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{ editingCategory.value ? "تعديل التصنيف" : "إضافة تصنيف جديد" }</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
						<TextField
							label="اسم التصنيف"
							value={ categoryName }
							required
						/>
						<SelectField<number>
							label="التصنيف الأب (اختياري)"
							value={ categoryParentId }
							options={ parentOptions }
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={ () => isDialogOpen.value = false }>
							إلغاء
						</Button>
						<Button
							disabled={ isSaving.value || !categoryName.value }
							onClick={ handleSave }
						>
							حفظ
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);

	function CommandItems({searchText}: { searchText: string })
	{
		useSignals();
		if (Cubits.categories.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.length > 0)
		{
			const categories = Cubits.categories.entities.value;
			let content: React.ReactNode;

			if (searchText)
			{
				content = categories.map((category) =>
				{
					const isParentSelected = category.parentCategoryId && localIds.value.includes(category.parentCategoryId);
					return (
						<MultiSearchableSelect.Option<CategoryDto>
							{ ...props }
							key={ category.id }
							ids={ localIds }
							labels={ localLabels }
							labelSelector="name"
							item={ category }
						>
							<div className="flex items-center justify-between w-full">
								<div
									className={ `flex items-center gap-2 flex-1 min-w-0 ${ isParentSelected ? "text-primary/80" : "" }` }>
									{ isParentSelected && <Check className="w-3.5 h-3.5 text-primary/50 shrink-0"/> }
									<span className="truncate">{ category.name }</span>
									{ category.parentCategoryName && (
										<span
											className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full whitespace-nowrap">
											{ category.parentCategoryName }
										</span>
									) }
								</div>
								<div className="flex items-center gap-1 ms-2">
									<button type="button" onClick={ (e) =>
									{
										e.preventDefault();
										e.stopPropagation();
										handleOpenEdit(category);
									} } className="p-1 text-muted-foreground hover:text-primary transition-colors">
										<Edit2 className="w-3.5 h-3.5"/></button>
									<button type="button" onClick={ (e) =>
									{
										e.preventDefault();
										e.stopPropagation();
										handleDelete(category);
									} } className="p-1 text-muted-foreground hover:text-destructive transition-colors">
										<Trash2 className="w-3.5 h-3.5"/></button>
								</div>
							</div>
						</MultiSearchableSelect.Option>
					);
				});
			}
			else
			{
				const parents = categories.filter(c => !c.parentCategoryId);
				const childrenByParent = new Map<number, CategoryDto[]>();
				categories.forEach(c =>
				{
					if (c.parentCategoryId)
					{
						if (!childrenByParent.has(c.parentCategoryId))
						{
							childrenByParent.set(c.parentCategoryId, []);
						}
						childrenByParent.get(c.parentCategoryId)!.push(c);
					}
				});

				content = parents.map(parent =>
				{
					const children = childrenByParent.get(parent.id) || [];
					if (children.length > 0)
					{
						const isExpanded = expanded.includes(parent.id);
						return (
							<React.Fragment key={ parent.id }>
								<MultiSearchableSelect.Option<CategoryDto>
									{ ...props }
									ids={ localIds }
									labels={ localLabels }
									labelSelector="name"
									item={ parent }
								>
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center gap-1 flex-1 min-w-0">
											<button
												type="button"
												onClick={ (e) =>
												{
													e.preventDefault();
													e.stopPropagation();
													toggleExpand(parent.id);
												} }
												className="p-1 -ms-1 hover:bg-muted/80 rounded-md transition-colors flex items-center justify-center"
											>
												{ isExpanded ? (
													<ChevronDown className="w-4 h-4 text-muted-foreground"/>
												) : (
													<ChevronLeft
														className={ `w-4 h-4 text-muted-foreground ${ !isRtl ? "rotate-180" : "" }` }/>
												) }
											</button>
											<span className="truncate font-semibold">{ parent.name }</span>
										</div>
										<div className="flex items-center gap-1 ms-2">
											<button type="button" onClick={ (e) =>
											{
												e.preventDefault();
												e.stopPropagation();
												handleOpenEdit(parent);
											} }
											        className="p-1 text-muted-foreground hover:text-primary transition-colors">
												<Edit2 className="w-3.5 h-3.5"/></button>
											<button type="button" onClick={ async (e) =>
											{
												e.preventDefault();
												e.stopPropagation();
												await handleDelete(parent);
											} }
											        className="p-1 text-muted-foreground hover:text-destructive transition-colors">
												<Trash2 className="w-3.5 h-3.5"/></button>
										</div>
									</div>
								</MultiSearchableSelect.Option>
								{ isExpanded && children.map(child =>
								{
									const isParentSelected = localIds.value.includes(child.parentCategoryId!);
									return (
										<MultiSearchableSelect.Option<CategoryDto>
											{ ...props }
											key={ child.id }
											ids={ localIds }
											labels={ localLabels }
											labelSelector="name"
											item={ child }
										>
											<div className="flex items-center justify-between w-full ps-7">
												<div
													className={ `flex items-center gap-2 flex-1 min-w-0 ${ isParentSelected ? "text-primary/80" : "" }` }>
													{ isParentSelected &&
                                                        <Check className="w-3.5 h-3.5 text-primary/50 shrink-0"/> }
													<span className="truncate">{ child.name }</span>
													{ child.parentCategoryName && (
														<span
															className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full whitespace-nowrap">
															{ child.parentCategoryName }
														</span>
													) }
												</div>
												<div className="flex items-center gap-1 ms-2">
													<button type="button" onClick={ (e) =>
													{
														e.preventDefault();
														e.stopPropagation();
														handleOpenEdit(child);
													} }
													        className="p-1 text-muted-foreground hover:text-primary transition-colors">
														<Edit2 className="w-3.5 h-3.5"/></button>
													<button type="button" onClick={ async (e) =>
													{
														e.preventDefault();
														e.stopPropagation();
														await handleDelete(child);
													} }
													        className="p-1 text-muted-foreground hover:text-destructive transition-colors">
														<Trash2 className="w-3.5 h-3.5"/></button>
												</div>
											</div>
										</MultiSearchableSelect.Option>
									);
								}) }
							</React.Fragment>
						);
					}
					else
					{
						return (
							<MultiSearchableSelect.Option<CategoryDto>
								{ ...props }
								key={ parent.id }
								ids={ localIds }
								labels={ localLabels }
								labelSelector="name"
								item={ parent }
							>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-2 flex-1 min-w-0">
										<span className="truncate font-semibold">{ parent.name }</span>
										{ parent.parentCategoryName && (
											<span
												className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full whitespace-nowrap">
												{ parent.parentCategoryName }
											</span>
										) }
									</div>
									<div className="flex items-center gap-1 ms-2">
										<button type="button" onClick={ (e) =>
										{
											e.preventDefault();
											e.stopPropagation();
											handleOpenEdit(parent);
										} } className="p-1 text-muted-foreground hover:text-primary transition-colors">
											<Edit2 className="w-3.5 h-3.5"/></button>
										<button type="button" onClick={ (e) =>
										{
											e.preventDefault();
											e.stopPropagation();
											handleDelete(parent);
										} }
										        className="p-1 text-muted-foreground hover:text-destructive transition-colors">
											<Trash2 className="w-3.5 h-3.5"/></button>
									</div>
								</div>
							</MultiSearchableSelect.Option>
						);
					}
				});
			}

			return <>{ content }</>;
		}

		if (searchText)
		{
			return (
				<div className="p-1">
					<Button
						type="button"
						variant="ghost"
						className="w-full justify-start text-sm h-8 px-2"
						onClick={ () => handleOpenAdd(searchText) }
					>
						<Plus className="h-4 w-4 me-2"/> إضافة "{ searchText }"
					</Button>
				</div>
			);
		}

		return <MultiSearchableSelect.Empty/>;
	}
}