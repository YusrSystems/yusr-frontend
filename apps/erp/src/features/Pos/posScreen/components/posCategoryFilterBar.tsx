import { useSignals } from "@preact/signals-react/runtime";
import { type Signal } from "@preact/signals-react";
import { Button, Checkbox, cn, PageLoaded } from "yusr-ui";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { CategoryDto } from "@/core/data/category";
import { Cubits } from "@/core/services/cubits";


interface PosCategoryFilterBarProps
{
	activeMode: Signal<"all" | "favorites" | "categories">;
	selectedCategoryIds: Signal<number[]>;
	expandedParentIds: Signal<number[]>;
}

export default function PosCategoryFilterBar({
	activeMode,
	selectedCategoryIds,
	expandedParentIds
}: PosCategoryFilterBarProps)
{
	useSignals();

	const isChildSelected = (child: CategoryDto) =>
	{
		if (!child.parentCategoryId) return false;
		return selectedCategoryIds.value.includes(child.id);
	};

	const isParentSelected = (parent: CategoryDto, categories: CategoryDto[]) =>
	{
		if (selectedCategoryIds.value.includes(parent.id)) return true;
		const children = categories.filter(c => c.parentCategoryId === parent.id);
		if (children.length === 0) return false;
		return children.every(c => selectedCategoryIds.value.includes(c.id));
	};

	const toggleParentCategory = (parent: CategoryDto, categories: CategoryDto[]) =>
	{
		const children = categories.filter(c => c.parentCategoryId === parent.id);
		const childIds = children.map(c => c.id);
		const parentIsSelected = isParentSelected(parent, categories);

		let nextIds = [...selectedCategoryIds.value];

		if (parentIsSelected)
		{
			// Uncheck parent and all its children
			nextIds = nextIds.filter(id => id !== parent.id && !childIds.includes(id));
		}
		else
		{
			// Check parent AND all its children (send all IDs)
			const toAdd = [parent.id, ...childIds];
			for (const id of toAdd)
			{
				if (!nextIds.includes(id))
				{
					nextIds.push(id);
				}
			}
		}

		selectedCategoryIds.value = nextIds;
		activeMode.value = nextIds.length > 0 ? "categories" : "all";
	};

	const toggleChildCategory = (child: CategoryDto, categories: CategoryDto[]) =>
	{
		if (!child.parentCategoryId) return;

		const parentId = child.parentCategoryId;
		const siblings = categories.filter(c => c.parentCategoryId === parentId);
		const childIsCurrentlySelected = selectedCategoryIds.value.includes(child.id) || selectedCategoryIds.value.includes(parentId);

		let nextIds = [...selectedCategoryIds.value];

		if (childIsCurrentlySelected)
		{
			// Unchecking child: remove child ID and parent ID (since parent is no longer fully selected)
			nextIds = nextIds.filter(id => id !== child.id && id !== parentId);
		}
		else
		{
			// Checking child: add child ID
			if (!nextIds.includes(child.id))
			{
				nextIds.push(child.id);
			}

			// If ALL siblings are now selected, ALSO add parent ID!
			const allSiblingsSelected = siblings.every(s => nextIds.includes(s.id));
			if (allSiblingsSelected)
			{
				if (!nextIds.includes(parentId))
				{
					nextIds.push(parentId);
				}
			}
		}

		selectedCategoryIds.value = nextIds;
		activeMode.value = nextIds.length > 0 ? "categories" : "all";
	};

	const toggleExpandParent = (parentId: number) =>
	{
		if (expandedParentIds.value.includes(parentId))
		{
			expandedParentIds.value = expandedParentIds.value.filter(id => id !== parentId);
		}
		else
		{
			expandedParentIds.value = [...expandedParentIds.value, parentId];
		}
	};

	return (
		<div className="px-3 pb-3 flex flex-col gap-2">
			{/* Mode Controls + Parent Category Pills */ }
			<div className="flex gap-2 items-center overflow-x-auto scrollbar-hide py-1">
				<Button
					variant={ activeMode.value === "all" ? "default" : "outline" }
					size="sm"
					className="rounded-full whitespace-nowrap h-8 text-xs font-bold shrink-0"
					onClick={ () =>
					{
						activeMode.value = "all";
						selectedCategoryIds.value = [];
					} }
				>
					الكل
				</Button>

				<Button
					variant={ activeMode.value === "favorites" ? "default" : "outline" }
					size="sm"
					className="rounded-full whitespace-nowrap h-8 text-xs font-bold gap-1 shrink-0"
					onClick={ () =>
					{
						activeMode.value = "favorites";
						selectedCategoryIds.value = [];
					} }
				>
					<Star
						className={ `w-3.5 h-3.5 ${ activeMode.value === "favorites" ? "fill-primary-foreground" : "fill-muted-foreground text-muted-foreground" }` }/>
					المفضلة
				</Button>

				<div className="w-px h-6 bg-border mx-1 self-center shrink-0"/>

				{ Cubits.categories.state.value instanceof PageLoaded && (() =>
				{
					const categories = Cubits.categories.entities.value;
					const parents = categories.filter(c => !c.parentCategoryId);

					return parents.map(parent => (
						<ParentCategoryPill
							key={ parent.id }
							parent={ parent }
							categories={ categories }
							isSelected={ isParentSelected(parent, categories) }
							isExpanded={ expandedParentIds.value.includes(parent.id) }
							onToggleSelect={ () => toggleParentCategory(parent, categories) }
							onToggleExpand={ () => toggleExpandParent(parent.id) }
						/>
					));
				})() }
			</div>

			{/* Sub-bar for Expanded Children */ }
			{ Cubits.categories.state.value instanceof PageLoaded && (() =>
			{
				const categories = Cubits.categories.entities.value;
				const expandedParents = categories.filter(c => !c.parentCategoryId && expandedParentIds.value.includes(c.id));

				if (expandedParents.length === 0) return null;

				return (
					<ExpandedCategoryChildrenSubRow
						expandedParents={ expandedParents }
						categories={ categories }
						isChildSelected={ isChildSelected }
						onToggleChildSelect={ (child) => toggleChildCategory(child, categories) }
					/>
				);
			})() }
		</div>
	);
}

function ParentCategoryPill({
	parent,
	categories,
	isSelected,
	isExpanded,
	onToggleSelect,
	onToggleExpand
}: {
	parent: CategoryDto;
	categories: CategoryDto[];
	isSelected: boolean;
	isExpanded: boolean;
	onToggleSelect: () => void;
	onToggleExpand: () => void;
})
{
	useSignals();
	const hasChildren = categories.some(c => c.parentCategoryId === parent.id);

	return (
		<div
			onClick={ onToggleSelect }
			className={ cn(
				"flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium shrink-0 transition-colors select-none cursor-pointer",
				isSelected
					? "bg-primary/10 border-primary text-primary font-bold"
					: "bg-background border-border hover:bg-muted"
			) }
		>
			<Checkbox
				id={ `cat-parent-${ parent.id }` }
				checked={ isSelected }
				tabIndex={ -1 }
				className="pointer-events-none"
			/>

			<span className="font-bold">{ parent.name }</span>

			{ hasChildren && (
				<button
					type="button"
					className="p-0.5 rounded-full hover:bg-muted-foreground/10 transition-colors text-muted-foreground ms-0.5"
					onClick={ (e) =>
					{
						e.stopPropagation();
						onToggleExpand();
					} }
					title={ isExpanded ? "إخفاء الفئات الفرعية" : "عرض الفئات الفرعية" }
				>
					{ isExpanded ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/> }
				</button>
			) }
		</div>
	);
}

function ExpandedCategoryChildrenSubRow({
	expandedParents,
	categories,
	isChildSelected,
	onToggleChildSelect
}: {
	expandedParents: CategoryDto[];
	categories: CategoryDto[];
	isChildSelected: (child: CategoryDto) => boolean;
	onToggleChildSelect: (child: CategoryDto) => void;
})
{
	useSignals();

	return (
		<div
			className="flex flex-col gap-2 pt-1.5 pb-1 border-t border-border/50 bg-muted/20 p-2 rounded-xl animate-in fade-in slide-in-from-top-1 max-h-32 overflow-y-auto">
			{ expandedParents.map(parent =>
			{
				const children = categories.filter(c => c.parentCategoryId === parent.id);
				if (children.length === 0) return null;

				return (
					<div key={ parent.id } className="flex items-center flex-wrap gap-1.5 text-xs">
						<span className="font-semibold text-muted-foreground shrink-0 text-[11px] px-1">
							{ parent.name }:
						</span>
						{ children.map(child =>
						{
							const selected = isChildSelected(child);
							return (
								<div
									key={ child.id }
									onClick={ () => onToggleChildSelect(child) }
									className={ cn(
										"flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0 transition-colors cursor-pointer select-none",
										selected
											? "bg-primary/15 border-primary text-primary font-semibold"
											: "bg-background border-border hover:bg-muted"
									) }
								>
									<Checkbox
										id={ `cat-child-${ child.id }` }
										checked={ selected }
										tabIndex={ -1 }
										className="pointer-events-none"
									/>
									<span>{ child.name }</span>
								</div>
							);
						}) }
					</div>
				);
			}) }
		</div>
	);
}