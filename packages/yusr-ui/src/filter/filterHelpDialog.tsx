import { ChevronDown, HelpCircle, Info, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/pure";
import type { PropsWithChildren } from "react";


export function FilterHelpDialog({open, onOpenChange}: { open: boolean, onOpenChange: (open: boolean) => void })
{
	const {t, i18n} = useTranslation("common");

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="text-muted-foreground hover:bg-muted"
					onPointerDown={ (e) =>
					{
						e.preventDefault();
						e.stopPropagation();
					} }
					onClick={ (e) =>
					{
						e.stopPropagation();
					} }
				>
					<HelpCircle className="h-4 w-4"/>
					{ t("filter.filterHelp.title") }
				</Button>
			</DialogTrigger>

			<DialogContent dir={ i18n.dir() } className="sm:max-w-150 max-h-[85vh] overflow-y-auto sm:rounded-xl">
				<DialogHeader>
					<DialogTitle>{ t("filter.filterHelp.title") }</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-6 py-4">

					<FilterHelpSection
						title={ t("filter.filterHelp.andTitle") }
						description={ t("filter.filterHelp.andDesc") }
						result={ t("filter.filterHelp.resultAnd") }
					>
						<div className="p-4 space-y-4">
							<MockRule
								field={ t("filter.filterHelp.mockCategory") }
								op={ t("filter.filterHelp.mockEqual") }
								value={ t("filter.filterHelp.mockElectronics") }
							/>

							<div
								className="flex items-center gap-2 text-base font-bold text-destructive ps-2">
								<Plus className="h-4 w-4"/>
								{ t("filter.filterHelp.and") }
							</div>

							<MockRule
								field={ t("filter.filterHelp.mockPrice") }
								op={ t("filter.filterHelp.mockGreaterThan") }
								value="500"
							/>
						</div>
					</FilterHelpSection>

					<div className="h-[1px] w-full bg-border"/>

					<FilterHelpSection
						title={ t("filter.filterHelp.orTitle") }
						description={ t("filter.filterHelp.orDesc") }
						result={ t("filter.filterHelp.resultOr") }
					>
						<div className="p-4 space-y-4">
							<div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 space-y-3">
								<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									{ t("filter.filterHelp.group") } 1
								</div>
								<MockRule
									field={ t("filter.filterHelp.mockCategory") }
									op={ t("filter.filterHelp.mockEqual") }
									value={ t("filter.filterHelp.mockElectronics") }
								/>
							</div>

							<div
								className="flex items-center gap-2 text-base font-bold text-destructive ps-2">
								<Plus className="h-4 w-4"/>
								{ t("filter.filterHelp.or") }
							</div>

							<div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 space-y-3">
								<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									{ t("filter.filterHelp.group") } 2
								</div>
								<MockRule
									field={ t("filter.filterHelp.mockCategory") }
									op={ t("filter.filterHelp.mockEqual") }
									value={ t("filter.filterHelp.mockClothing") }
								/>
							</div>
						</div>
					</FilterHelpSection>

				</div>
			</DialogContent>
		</Dialog>
	);
}

function MockRule({field, op, value}: { field: string; op: string; value: string })
{
	return (
		<div className="flex flex-wrap items-start gap-2 pointer-events-none opacity-80">
			<div
				className="flex h-9 w-32 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background">
				{ field } <ChevronDown className="h-4 w-4 opacity-50"/>
			</div>
			<div
				className="flex h-9 w-32 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background">
				{ op } <ChevronDown className="h-4 w-4 opacity-50"/>
			</div>
			<div
				className="flex h-9 flex-1 min-w-[120px] items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background">
				{ value }
			</div>
		</div>
	);
}

function FilterHelpSection({title, description, result, children}: {
	title: string;
	description: string;
	result: string
} & PropsWithChildren)
{
	return (
		<div className="space-y-4">
			<div className="space-y-1.5">
				<h3 className="inline-flex items-center rounded-md border px-2.5 py-1
								font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring
								focus:ring-offset-2 bg-secondary text-secondary-foreground">

					{ title }
				</h3>
				<p className="text-sm ">
					{ description }
				</p>
			</div>

			<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
				{ children }

				<div
					className="flex items-start gap-3 rounded-b-xl border-t bg-muted/50 p-4 text-destructive">
					<Info className="h-4 w-4 mt-0.5 shrink-0"/>
					<h3 className="">{ result }</h3>
				</div>
			</div>
		</div>
	);
}