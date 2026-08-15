import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { CategoryDto } from "@/core/data/category.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { CategoryOptionItem } from "./categoryOptionItem";


interface CategoriesSearchableCommandItemsProps extends SearchableSelectProps<CategoryDto>
{
	searchText: string;
	expanded: number[];
	onToggleExpand: (id: number) => void;
	onOpenAdd: (text: string) => void;
	onOpenEdit: (category: CategoryDto) => void;
	onDelete: (category: CategoryDto) => void;
}

export function CategoriesSearchableCommandItems({
	searchText,
	expanded,
	onToggleExpand,
	onOpenAdd,
	onOpenEdit,
	onDelete,
	...props
}: CategoriesSearchableCommandItemsProps)
{
	useSignals();
	const {i18n} = useTranslation();
	const isRtl = i18n.dir() === "rtl";

	if (Cubits.categories.state.value instanceof PageLoading)
	{
		return <SearchableSelect.Loading/>;
	}

	if (Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.length > 0)
	{
		const categories = Cubits.categories.entities.value;

		if (searchText)
		{
			return (
				<>
					{ categories.map((entity) => (
						<Option
							key={ entity.id }
							item={ entity }
							onEdit={ () => onOpenEdit(entity) }
							onDelete={ () => onDelete(entity) }
							{ ...props }
						/>
					)) }
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
								<Option
									item={ parent }
									isExpanded={ isExpanded }
									isRtl={ isRtl }
									onToggleExpand={ () => onToggleExpand(parent.id) }
									onEdit={ () => onOpenEdit(parent) }
									onDelete={ () => onDelete(parent) }
									{ ...props }
								/>
								{ isExpanded &&
									children.map(child => (
										<div key={ child.id } className="ps-4">
											<Option
												item={ child }
												onEdit={ () => onOpenEdit(child) }
												onDelete={ () => onDelete(child) }
												{ ...props }
											/>
										</div>
									)) }
							</React.Fragment>
						);
					}

					return (
						<Option
							key={ parent.id }
							item={ parent }
							onEdit={ () => onOpenEdit(parent) }
							onDelete={ () => onDelete(parent) }
							{ ...props }
						/>
					);
				}) }
			</>
		);
	}

	return (
		<SearchableSelect.AddOptionButton
			onCreate={ async (text, closeCommand) =>
			{
				onOpenAdd(text ?? "");
				closeCommand();
			} }
		/>
	);
}

const Option = React.memo(
	function Option({
		isExpanded,
		isRtl,
		onToggleExpand,
		onEdit,
		onDelete,
		...props
	}: Omit<SearchableSelectOptionProps<CategoryDto>, "labelSelector"> & {
		isExpanded?: boolean;
		isRtl?: boolean;
		onToggleExpand?: () => void;
		onEdit?: () => void;
		onDelete?: () => void;
	})
	{
		useSignals();

		return (
			<SearchableSelect.Option<CategoryDto> labelSelector="name" { ...props }>
				<CategoryOptionItem
					category={ props.item }
					isExpanded={ isExpanded }
					isRtl={ isRtl }
					onToggleExpand={ onToggleExpand }
					onEdit={ onEdit }
					onDelete={ onDelete }
				/>
			</SearchableSelect.Option>
		);
	}
);