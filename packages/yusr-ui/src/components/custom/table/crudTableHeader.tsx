import { Menu, PlusIcon, X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Button } from "../../pure/button";


export type CrudTableHeaderProps = {
	title: string;
	addButtonTitle: string;
	isAddButtonVisible?: boolean;
	onAddButtonClicked: () => void;
	actionButtons?: ReactNode[];
};

export function CrudTableHeader(
	{
		title,
		addButtonTitle,
		isAddButtonVisible = true,
		onAddButtonClicked,
		actionButtons
	}: CrudTableHeaderProps
)
{
	useSignals();
	const hasActionButtons = (actionButtons?.length ?? 0) > 0;

	return (
		<div className="flex justify-between mb-8 gap-3">
			<div>
				<h1>{ title }</h1>
			</div>

			<div className="flex items-center gap-3">
				{ hasActionButtons && (
					<TableHeaderActionButtons actionButtons={ actionButtons }/>
				) }

				{ isAddButtonVisible && (
					<Button variant="default" onClick={ onAddButtonClicked }>
						<PlusIcon className="h-4 w-4"/>
						{ addButtonTitle }
					</Button>
				) }
			</div>
		</div>
	);
}

export function TableHeaderActionButtons({actionButtons}: { actionButtons?: ReactNode[]; })
{
	const isMenuOpen = useSignal(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(
		() =>
		{
			if (!isMenuOpen.value) return;

			function handleClickOutside(event: MouseEvent)
			{
				if (menuRef.current && !menuRef.current.contains(event.target as Node))
				{
					isMenuOpen.value = false;
				}
			}

			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		},
		[isMenuOpen.value]
	);

	return <>
		<div className="hidden sm:flex items-center gap-3">
			{ actionButtons }
		</div>

		<div className="relative sm:hidden" ref={ menuRef }>
			<button
				type="button"
				aria-label={ isMenuOpen.value ? "Close actions menu" : "Open actions menu" }
				aria-expanded={ isMenuOpen.value }
				onClick={ () =>
				{
					isMenuOpen.value = !isMenuOpen.value;
				} }
				className="inline-flex items-center justify-center rounded-md p-2 border border-border/50"
			>
				{ isMenuOpen.value
					? <X className="h-4 w-4"/>
					: <Menu className="h-4 w-4"/>
				}
			</button>

			{ isMenuOpen.value && (
				<div
					className="absolute ltr:right-0 rtl:left-0 top-full mt-2 z-50 flex flex-col gap-2 rounded-md border border-border/50 bg-background p-2 shadow-md min-w-[160px]">
					{ actionButtons?.map(
						(actionButton, index) => (
							<div key={ index } onClick={ () =>
							{
								isMenuOpen.value = false;
							} }>
								{ actionButton }
							</div>
						)
					) }
				</div>
			) }
		</div>
	</>;
}