import type { Signal } from "@preact/signals-react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "#/utils/cn.ts";
import {
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "../../pure";


export interface MultiSelectInputProps<T extends string | number>
{
	value: Signal<T[]>;
	options: { label: string; value: T }[];
	placeholder?: string;
	disabled?: boolean;
}

export function MultiSelectInput<T extends string | number>(
	{value, options, placeholder, disabled}: MultiSelectInputProps<T>
)
{
	useSignals();
	const {t, i18n} = useTranslation("common");
	const isOpen = useMemo(() => signal(false), []);

	const selectedOptions = options.filter((o) => value.value.includes(o.value));

	const toggle = (optionValue: T) =>
	{
		value.value = value.value.includes(optionValue)
			? value.value.filter((v) => v !== optionValue)
			: [...value.value, optionValue];
	};

	return (
		<Popover open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open } modal={ true }>
			<PopoverTrigger asChild>
				<Button
					dir={ i18n.dir() }
					variant="outline"
					role="combobox"
					aria-expanded={ isOpen.value }
					disabled={ disabled }
					className="w-full justify-between font-normal"
				>
					<div className="flex flex-wrap gap-1 flex-1 justify-start">
						{ selectedOptions.length === 0 && (
							<span className="text-muted-foreground truncate">
								{ placeholder || t("searchableSelect.placeholder") }
							</span>
						) }
						{ selectedOptions.length > 0 && selectedOptions.length <= 3 && selectedOptions.map((opt) => (
							<Badge key={ String(opt.value) } variant="secondary" className="font-normal">
								{ opt.label }
							</Badge>
						)) }
						{ selectedOptions.length > 3 && (
							<Badge variant="secondary" className="font-normal">
								{ t("searchableSelect.selectedCount", {count: selectedOptions.length}) }
							</Badge>
						) }
					</div>
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ltr:ml-2 rtl:mr-2"/>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir={ i18n.dir() }>
				<Command>
					<CommandList className="max-h-50 overflow-y-auto overflow-x-hidden">
						<CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
							{ t("searchableSelect.noData") }
						</CommandEmpty>
						<CommandGroup>
							{ options.map((opt) =>
							{
								const isSelected = value.value.includes(opt.value);
								return (
									<CommandItem
										key={ String(opt.value) }
										value={ String(opt.value) }
										onSelect={ () => toggle(opt.value) }
										className="cursor-pointer group"
									>
										<Check
											className={ cn(
												"h-4 w-4 ltr:mr-2 rtl:ml-2 shrink-0",
												isSelected ? "opacity-100" : "opacity-0"
											) }
										/>
										<span className="flex-1 truncate">{ opt.label }</span>
									</CommandItem>
								);
							}) }
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}