import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services.ts";
import { CategoryDto } from "@/core/data/category.ts";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo, useState } from "react";
import { signal } from "@preact/signals-react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps,
	SelectField,
	TextField
} from "yusr-ui";
import { ChevronDown, ChevronLeft, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function CategoriesSearchableSelect(
	{...props}: SearchableSelectProps<CategoryDto>
)
{
	useSignals();
	const {i18n} = useTranslation();
	const isRtl = i18n.dir() === "rtl";
	const [searchText, setSearchText] = useState("");
	const [expanded, setExpanded] = useState<number[]>([]);

	const isDialogOpen = useMemo(() => signal(false), []);
	const editingCategory = useMemo(() => signal<CategoryDto | undefined>(undefined), []);
	const categoryName = useMemo(() => signal(""), []);
	const categoryParentId = useMemo(() => signal<number>(0), []);
	const isSaving = useMemo(() => signal(false), []);

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
			if (props.id?.value === category.id)
			{
				props.id.value = undefined;
				if (props.label) props.label.value = "";
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
					if (props.id?.value === res.data.id && props.label)
					{
						props.label.value = res.data.name;
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
					if (props.id) props.id.value = res.data.id;
					if (props.label) props.label.value = res.data.name;
					if (props.onSelect) props.onSelect(res.data);
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
						<CommandItems/>
					</SearchableSelect.Command>
				</SearchableSelect.Content>
			</SearchableSelect>

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

	function CommandItems()
	{
		useSignals();
		if (Cubits.categories.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.length > 0)
		{
			const categories = Cubits.categories.entities.value;
			let content: React.ReactNode;

			if (searchText)
			{
				content = categories.map((entity) => (
					<Option
						key={ entity.id }
						item={ entity }
						onEdit={ () => handleOpenEdit(entity) }
						onDelete={ () => handleDelete(entity) }
						{ ...props }
					/>
				));
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
								<div
									onClick={ (e) =>
									{
										e.stopPropagation();
										toggleExpand(parent.id);
									} }
									className="flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded-sm font-semibold text-foreground group"
								>
									<div className="flex items-center">
										{ isExpanded ? <ChevronDown className="w-4 h-4 me-2 text-muted-foreground"/> :
											<ChevronLeft
												className={ `w-4 h-4 me-2 text-muted-foreground ${ !isRtl ? "rotate-180" : "" }` }/> }
										<span>{ parent.name }</span>
									</div>
									<div
										className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
								{ isExpanded && children.map(child => (
									<div key={ child.id } className="ps-6">
										<Option
											item={ child }
											onEdit={ () => handleOpenEdit(child) }
											onDelete={ () => handleDelete(child) }
											{ ...props }
										/>
									</div>
								)) }
							</React.Fragment>
						);
					}
					else
					{
						return <Option
							key={ parent.id }
							item={ parent }
							onEdit={ () => handleOpenEdit(parent) }
							onDelete={ () => handleDelete(parent) }
							{ ...props }
						/>;
					}
				});
			}

			return <>{ content }</>;
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (text, closeCommand) =>
				{
					handleOpenAdd(text ?? "");
					closeCommand();
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{onEdit, onDelete, ...props}: Omit<SearchableSelectOptionProps<CategoryDto>, "labelSelector"> & {
			onEdit?: () => void;
			onDelete?: () => void;
		}
	)
	{
		useSignals();

		return (
			<SearchableSelect.Option<CategoryDto>
				labelSelector="name"
				{ ...props }
			>
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<span className="truncate">{ props.item.name }</span>
					{ props.item.parentCategoryName && (
						<span
							className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full whitespace-nowrap">
							{ props.item.parentCategoryName }
						</span>
					) }
				</div>
				<div className="flex items-center gap-1">
					{ onEdit && <SearchableSelect.EditOptionButton onEdit={ onEdit }/> }
					{ onDelete && <SearchableSelect.DeleteOptionButton onDelete={ async () => onDelete() }/> }
				</div>
			</SearchableSelect.Option>
		);
	}
);