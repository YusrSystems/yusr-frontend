import React from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { CategoryDto } from "@/core/data/category.ts";
import { MultiSearchableSelect, SearchableSelect } from "yusr-ui";


interface CategoryOptionItemProps
{
	category: CategoryDto;
	isExpanded?: boolean;
	isRtl?: boolean;
	onToggleExpand?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	extraBadge?: React.ReactNode;
	className?: string;
	isMulti?: boolean;
}

export const CategoryOptionItem: React.FC<CategoryOptionItemProps> = React.memo(({
	category,
	isExpanded,
	isRtl = true,
	onToggleExpand,
	onEdit,
	onDelete,
	extraBadge,
	className = "",
	isMulti = false
}) =>
{
	const DeleteBtn = isMulti ? MultiSearchableSelect.DeleteOptionButton : SearchableSelect.DeleteOptionButton;
	const EditBtn = isMulti ? MultiSearchableSelect.EditOptionButton : SearchableSelect.EditOptionButton;

	return (
		<div className={ `flex items-center justify-between w-full ${ className }` }>
			<div className="flex items-center gap-1.5 flex-1 min-w-0">
				{ onToggleExpand && (
					<button
						type="button"
						onClick={ (e) =>
						{
							e.preventDefault();
							e.stopPropagation();
							onToggleExpand();
						} }
						className="p-1 -ms-1 hover:bg-muted/80 rounded-md transition-colors flex items-center justify-center shrink-0"
					>
						{ isExpanded ? (
							<ChevronDown className="w-4 h-4 text-muted-foreground"/>
						) : (
							<ChevronLeft
								className={ `w-4 h-4 text-muted-foreground ${ !isRtl ? "rotate-180" : "" }` }
							/>
						) }
					</button>
				) }

				<span className={ `truncate ${ category.parentCategoryId ? "font-normal" : "font-semibold" }` }>
					{ category.name }
				</span>

				{ category.parentCategoryName && (
					<span
						className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full whitespace-nowrap">
						{ category.parentCategoryName }
					</span>
				) }

				{ extraBadge }
			</div>

			<div className="flex items-center gap-1 ms-2 shrink-0">
				{ onEdit && <EditBtn onEdit={ onEdit }/> }
				{ onDelete && <DeleteBtn onDelete={ async () => onDelete() }/> }
			</div>
		</div>
	);
});