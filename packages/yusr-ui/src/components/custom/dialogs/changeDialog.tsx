import React, { type PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ChangeableEntity, Dto } from "#/stateManager";
import { cn } from "#/utils/cn.ts";
import { Button } from "../../pure/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "../../pure/dialog";
import { Separator } from "#/components/pure";
import { SaveButton, type SaveButtonProps, TabButton, UnauthorizedPage } from "#/components/custom";


export type ChangeDialogProps =
	& PropsWithChildren
	& {
	className?: string;
};

export type ChangeDialogHeaderProps = PropsWithChildren & { title: string; description?: string; };

export type ChangeDialogTabProps = {
	active: boolean;
	hasError?: boolean;
	icon: any;
	label: string;
	content: React.ReactElement;
};

export function ChangeDialog({className = "sm:max-w-sm", children}: ChangeDialogProps)
{
	const {i18n} = useTranslation("common");

	return (
		<DialogContent dir={ i18n.dir() } className={ cn("max-h-[94dvh] flex flex-col overflow-hidden", className) }>
			{ children }
		</DialogContent>
	);
}

ChangeDialog.Unauthorized = function ()
{
	const {t, i18n} = useTranslation("common");

	return (
		<DialogContent className="sm:max-w-xl" dir={ i18n.dir() }>
			<DialogHeader>
				<DialogTitle>{ t("changeDialog.unauthorized") }</DialogTitle>
				<DialogDescription></DialogDescription>
			</DialogHeader>
			<UnauthorizedPage showButtons={ false }/>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">{ t("changeDialog.close") }</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
};

ChangeDialog.Header = function ({title, description, children}: ChangeDialogHeaderProps)
{
	return (
		<div className="shrink-0 space-y-4">
			<DialogHeader>
				<DialogTitle>{ title }</DialogTitle>
				<DialogDescription>{ description ?? "" }</DialogDescription>
				{ children }
			</DialogHeader>

			<Separator/>
		</div>
	);
};

ChangeDialog.Footer = function ({children}: PropsWithChildren)
{
	return (
		<DialogFooter className="shrink-0 mt-auto">
			{ children }
		</DialogFooter>
	);
};

ChangeDialog.Close = function ()
{
	const {t} = useTranslation("common");
	return (
		<DialogClose asChild>
			<Button variant="outline">{ t("changeDialog.cancel") }</Button>
		</DialogClose>
	);
};

ChangeDialog.SaveButton = function <TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
	{...props}: SaveButtonProps<TEntity, TDto>
)
{
	return <SaveButton<TEntity, TDto> { ...props } />;
};

ChangeDialog.Tabbed = function ({tabs, className}: { tabs: ChangeDialogTabProps[]; className?: string; })
{
	const [currentTab, setCurrentTab] = useState(0);
	const safeTab = Math.min(currentTab, tabs.length - 1);

	return (
		<div className={ cn("flex flex-col flex-1 min-h-0 overflow-hidden", className) }>
			<div
				className="flex justify-start border-b mb-3 sm:mb-4 shrink-0 bg-muted/20 rounded-t-lg overflow-x-auto no-scrollbar max-w-full">
				{ tabs.map((tab, i) => (
					<TabButton
						key={ i }
						active={ safeTab === i }
						hasError={ tab.hasError }
						icon={ tab.icon }
						label={ tab.label }
						onClick={ () => setCurrentTab(i) }
						content={ tab.content }
					/>
				)) }
			</div>
			<div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 pb-2">
				{ tabs[safeTab]?.content }
			</div>
		</div>
	);
};