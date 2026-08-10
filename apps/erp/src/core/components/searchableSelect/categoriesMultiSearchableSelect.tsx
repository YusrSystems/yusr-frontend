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
import React, { useMemo, useState } from "react";
import { Signal, signal } from "@preact/signals-react";
import { CategoryDto } from "@/core/data/category.ts";
import { ChevronDown, ChevronLeft, Plus } from "lucide-react";
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

	const isAddOpen = useMemo(() => signal(false), []);
	const newCategoryName = useMemo(() => signal(""), []);
	const newCategoryParentId = useMemo(() => signal<number>(0), []);
	const isSaving = useMemo(() => signal(false), []);

	const toggleExpand = (id: number) =>
	{
		setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
	};

	const parentOptions = useMemo(() =>
	{
		return [
			{label: "بدون تصنيف أب", value: 0},
			...Cubits.categories.entities.value.filter(c => !c.parentCategoryId).map(c => ({
				label: c.name,
				value: c.id
			}))
		];
	}, [Cubits.categories.entities.value]);

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

			<Dialog open={ isAddOpen.value } onOpenChange={ (open) => isAddOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>إضافة تصنيف جديد</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
						<TextField
							label="اسم التصنيف"
							value={ newCategoryName }
							required
						/>
						<SelectField<number>
							label="التصنيف الأب (اختياري)"
							value={ newCategoryParentId }
							options={ parentOptions }
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={ () => isAddOpen.value = false }>
							إلغاء
						</Button>
						<Button
							disabled={ isSaving.value || !newCategoryName.value }
							onClick={ async () =>
							{
								isSaving.value = true;
								const res = await Services.categoriesApi.Add({
									name: newCategoryName.value,
									parentCategoryId: newCategoryParentId.value === 0 ? undefined : newCategoryParentId.value
								} as CategoryDto);
								if (res.data)
								{
									Cubits.categories.init();
									localIds.value = [...localIds.value, res.data.id];
									localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
									setSearchText("");
									Cubits.categories.search("");
									isAddOpen.value = false;
								}
								isSaving.value = false;
							} }
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
					const label = category.parentCategoryName ? `${ category.parentCategoryName } > ${ category.name }` : category.name;
					return (
						<MultiSearchableSelect.Option<CategoryDto>
							{ ...props }
							key={ category.id }
							ids={ localIds }
							labels={ localLabels }
							labelSelector="name"
							item={ category }
						>
							<MultiSearchableSelect.OptionBody label={ label }/>
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
								<div
									onClick={ (e) =>
									{
										e.stopPropagation();
										toggleExpand(parent.id);
									} }
									className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded-sm font-semibold text-foreground"
								>
									{ isExpanded ? <ChevronDown className="w-4 h-4 me-2 text-muted-foreground"/> :
										<ChevronLeft
											className={ `w-4 h-4 me-2 text-muted-foreground ${ !isRtl ? "rotate-180" : "" }` }/> }
									<span>{ parent.name }</span>
								</div>
								{ isExpanded && children.map(child => (
									<div key={ child.id } className="ps-6">
										<MultiSearchableSelect.Option<CategoryDto>
											{ ...props }
											ids={ localIds }
											labels={ localLabels }
											labelSelector="name"
											item={ child }
										>
											<MultiSearchableSelect.OptionBody label={ child.name }/>
										</MultiSearchableSelect.Option>
									</div>
								)) }
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
								<MultiSearchableSelect.OptionBody label={ parent.name }/>
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
						onClick={ () =>
						{
							newCategoryName.value = searchText;
							newCategoryParentId.value = 0;
							isAddOpen.value = true;
						} }
					>
						<Plus className="h-4 w-4 me-2"/> إضافة "{ searchText }"
					</Button>
				</div>
			);
		}

		return <MultiSearchableSelect.Empty/>;
	}
}