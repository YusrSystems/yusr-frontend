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
import { ChevronDown, ChevronLeft } from "lucide-react";
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
									if (props.id) props.id.value = res.data.id;
									if (props.label) props.label.value = res.data.name;
									if (props.onSelect) props.onSelect(res.data);
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
					<Option key={ entity.id } item={ entity } { ...props } showParentName/>
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
									className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded-sm font-semibold text-foreground"
								>
									{ isExpanded ? <ChevronDown className="w-4 h-4 me-2 text-muted-foreground"/> :
										<ChevronLeft
											className={ `w-4 h-4 me-2 text-muted-foreground ${ !isRtl ? "rotate-180" : "" }` }/> }
									<span>{ parent.name }</span>
								</div>
								{ isExpanded && children.map(child => (
									<div key={ child.id } className="ps-6">
										<Option item={ child } { ...props } />
									</div>
								)) }
							</React.Fragment>
						);
					}
					else
					{
						return <Option key={ parent.id } item={ parent } { ...props } />;
					}
				});
			}

			return <>{ content }</>;
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (text, closeCommand) =>
				{
					newCategoryName.value = text ?? "";
					newCategoryParentId.value = 0;
					isAddOpen.value = true;
					closeCommand();
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{showParentName, ...props}: Omit<SearchableSelectOptionProps<CategoryDto>, "labelSelector"> & {
			showParentName?: boolean
		}
	)
	{
		useSignals();
		const label = showParentName && props.item.parentCategoryName
			? `${ props.item.parentCategoryName } > ${ props.item.name }`
			: props.item.name;

		return (
			<SearchableSelect.Option<CategoryDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ label }/>
			</SearchableSelect.Option>
		);
	}
);