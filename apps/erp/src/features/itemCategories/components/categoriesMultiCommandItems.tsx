import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { Button, MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { CategoryDto } from "@/core/data/category.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { Check, Plus } from "lucide-react";
import { Signal } from "@preact/signals-react";
import { CategoryOptionItem } from "./categoryOptionItem";


interface CategoriesMultiCommandItemsProps extends Omit<MultiSearchableSelectProps<CategoryDto>, "ids">
{
	localIds: Signal<number[]>;
	localLabels: Signal<Record<number, string>>;
	searchText: string;
	expanded: number[];
	onToggleExpand: (id: number) => void;
	onOpenAdd: (text: string) => void;
	onOpenEdit: (category: CategoryDto) => void;
	onDelete: (category: CategoryDto) => void;
}

export function CategoriesMultiCommandItems({
	localIds,
	localLabels,
	searchText,
	expanded,
	onToggleExpand,
	onOpenAdd,
	onOpenEdit,
	onDelete,
	...props
}: CategoriesMultiCommandItemsProps)
{
	useSignals();
	const {i18n} = useTranslation();
	const isRtl = i18n.dir() === "rtl";

	if (Cubits.categories.state.value instanceof PageLoading)
	{
		return <MultiSearchableSelect.Loading/>;
	}

	if (Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.length > 0)
	{
		const categories = Cubits.categories.entities.value;

		if (searchText)
		{
			return (
				<>
					{ categories.map((category) =>
					{
						const isParentSelected =
							category.parentCategoryId && localIds.value.includes(category.parentCategoryId);
						return (
							<MultiSearchableSelect.Option<CategoryDto>
								{ ...props }
								key={ category.id }
								ids={ localIds }
								labels={ localLabels }
								labelSelector="name"
								item={ category }
							>
								<CategoryOptionItem
									category={ category }
									onEdit={ () => onOpenEdit(category) }
									onDelete={ () => onDelete(category) }
									extraBadge={
										isParentSelected ? (
											<Check className="w-3.5 h-3.5 text-primary/50 shrink-0 ms-1"/>
										) : undefined
									}
									className={ isParentSelected ? "text-primary/80" : "" }
								/>
							</MultiSearchableSelect.Option>
						);
					}) }
				</>
			);
		}

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

		return (
			<>
				{ parents.map(parent =>
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
									<CategoryOptionItem
										category={ parent }
										isExpanded={ isExpanded }
										isRtl={ isRtl }
										onToggleExpand={ () => onToggleExpand(parent.id) }
										onEdit={ () => onOpenEdit(parent) }
										onDelete={ () => onDelete(parent) }
									/>
								</MultiSearchableSelect.Option>
								{ isExpanded &&
									children.map(child =>
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
												<div className="ps-6 w-full">
													<CategoryOptionItem
														category={ child }
														onEdit={ () => onOpenEdit(child) }
														onDelete={ () => onDelete(child) }
														extraBadge={
															isParentSelected ? (
																<Check
																	className="w-3.5 h-3.5 text-primary/50 shrink-0 ms-1"/>
															) : undefined
														}
														className={ isParentSelected ? "text-primary/80" : "" }
													/>
												</div>
											</MultiSearchableSelect.Option>
										);
									}) }
							</React.Fragment>
						);
					}

					return (
						<MultiSearchableSelect.Option<CategoryDto>
							{ ...props }
							key={ parent.id }
							ids={ localIds }
							labels={ localLabels }
							labelSelector="name"
							item={ parent }
						>
							<CategoryOptionItem
								category={ parent }
								onEdit={ () => onOpenEdit(parent) }
								onDelete={ () => onDelete(parent) }
							/>
						</MultiSearchableSelect.Option>
					);
				}) }
			</>
		);
	}

	if (searchText)
	{
		return (
			<div className="p-1">
				<Button
					type="button"
					variant="ghost"
					className="w-full justify-start text-sm h-8 px-2"
					onClick={ () => onOpenAdd(searchText) }
				>
					<Plus className="h-4 w-4 me-2"/> إضافة "{ searchText }"
				</Button>
			</div>
		);
	}

	return <MultiSearchableSelect.Empty/>;
}