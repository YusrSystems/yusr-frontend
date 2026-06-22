import { signal, type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ChevronDown, ListFilter, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/pure";
import { DateInput, NumberField, SelectField, TextField } from "../components/custom";
import {
	FilterFieldsCubit,
	FilterFieldsError,
	FilterFieldsLoaded,
	FilterFieldsLoading
} from "../stateManager/filterFieldsCubit.ts";

import { FilterFieldType } from "./filterFieldType.ts";
import { FilterOperator } from "./filterOperator.ts";
import type { FilterFieldMetadataDto } from "./filterFieldMetadataDto.ts";
import { FilterGroup, type FilterGroupDto } from "./filterGroup.ts";
import { FilterRule } from "./filterRule.ts";


export const MAX_GROUPS = 5;
export const MAX_RULES_PER_GROUP = 10;

export type FilterValueInputProps = {
	rule: FilterRule;
	field: FilterFieldMetadataDto;
};

export type FilterSectionProps = {
	fieldsCubit: FilterFieldsCubit;
	onApply: (groups: FilterGroupDto[]) => void;
	onClear: () => void;
	renderCustomInput?: (props: FilterValueInputProps) => React.ReactNode | undefined;
};

export function FilterSection({fieldsCubit, onApply, onClear, renderCustomInput}: FilterSectionProps)
{
	useSignals();
	const {t} = useTranslation("common");
	const isOpen = useMemo(() => signal(false), []);
	const groups = useMemo(() => signal<FilterGroup[]>([FilterGroup.create()]), []);
	const activeFilterCount = useMemo(() => signal(0), []);

	useEffect(() =>
	{
		fieldsCubit.load();
	}, [fieldsCubit]);

	const fields = fieldsCubit.fields;
	const state = fieldsCubit.state.value;
	const isLoading = state instanceof FilterFieldsLoading;
	const hasError = state instanceof FilterFieldsError;
	const isLoaded = state instanceof FilterFieldsLoaded;

	const fieldOptions = fields.value.map((f) => ({label: f.localizedName, value: f.propertyName}));

	const getFieldMeta = (propertyName: string) =>
		fields.value.find((f) => f.propertyName === propertyName);

	const onFieldChange = (rule: FilterRule, propertyName: string) =>
	{
		const meta = getFieldMeta(propertyName);
		const firstOperator = meta?.filterOperators[0]?.operator ?? FilterOperator.Equal;
		rule.field.value = propertyName;
		rule.operator.value = firstOperator;
		rule.value.value = "";
	};

	const onOperatorChange = (rule: FilterRule, operator: FilterOperator) =>
	{
		const isArrayOp = operator === FilterOperator.Includes || operator === FilterOperator.NotIncludes;
		const wasArrayOp = rule.operator.value === FilterOperator.Includes || rule.operator.value === FilterOperator.NotIncludes;

		rule.operator.value = operator;
		if (isArrayOp !== wasArrayOp)
		{
			rule.value.value = isArrayOp ? [] : "";
		}
	};

	const addRule = (group: FilterGroup) =>
	{
		if (group.rules.value.length >= MAX_RULES_PER_GROUP) return;
		group.rules.value = [...group.rules.value, FilterRule.create()];
	};

	const removeRule = (groupIndex: number, ruleIndex: number) =>
	{
		const group = groups.value[groupIndex]!;
		const nextRules = group.rules.value.filter((_, i) => i !== ruleIndex);

		if (nextRules.length === 0)
		{
			const nextGroups = groups.value.filter((_, i) => i !== groupIndex);
			groups.value = nextGroups.length > 0 ? nextGroups : [FilterGroup.create()];
		}
		else
		{
			group.rules.value = nextRules;
		}
	};

	const addGroup = () =>
	{
		if (groups.value.length >= MAX_GROUPS) return;
		groups.value = [...groups.value, FilterGroup.create()];
	};

	const removeGroup = (groupIndex: number) =>
	{
		const nextGroups = groups.value.filter((_, i) => i !== groupIndex);
		groups.value = nextGroups.length > 0 ? nextGroups : [FilterGroup.create()];
	};

	const isRuleComplete = (rule: FilterRule) =>
	{
		const field = rule.field.value;
		const value = rule.value.value;
		if (!field || !rule.operator.value) return false;
		if (Array.isArray(value)) return value.length > 0;
		return value !== "" && value !== null && value !== undefined;
	};

	const handleApply = () =>
	{
		const completeGroupDtos: FilterGroupDto[] = groups.value
			.map((g) =>
			{
				const completeRules = g.rules.value.filter(isRuleComplete);
				// g.toJson() serializes the object, we just overwrite the rules locally
				return {...g.toJson(), rules: completeRules.map((r) => r.toJson())} as FilterGroupDto;
			})
			.filter((g) => g.rules.length > 0);

		activeFilterCount.value = completeGroupDtos.reduce((sum, g) => sum + g.rules.length, 0);
		onApply(completeGroupDtos);
	};

	const handleClear = () =>
	{
		groups.value = [FilterGroup.create()];
		activeFilterCount.value = 0;
		onClear();
	};

	return (
		<Collapsible open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }
		             className="border border-b-0 rounded-t-xl bg-card overflow-hidden shadow-sm"
		>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className={ `bg-muted flex w-full items-center justify-between px-4 py-3.5 transition-all outline-none border-b ${
						isOpen.value
							? "bg-muted/30 border-border"
							: "bg-background hover:bg-muted/40 border-transparent"
					}` }
				>
					<div className="flex items-center gap-3">
						<div
							className={ `p-1.5 rounded-md ${ activeFilterCount.value > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground" }` }>
							<ListFilter className="h-4 w-4"/>
						</div>

						<span className="font-semibold text-sm">
							{ t("filter.title", "Advanced Filters") }
						</span>

						{ activeFilterCount.value > 0 && (
							<span
								className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 shadow-sm">
								{ activeFilterCount.value } { t("filter.active", "Active") }
							</span>
						) }
					</div>

					<div className="flex items-center gap-2 text-muted-foreground">
						{ !isOpen.value && activeFilterCount.value === 0 && (
							<span className="text-xs hidden sm:inline-block mr-2">
								{ t("filter.clickToExpand") }
							</span>
						) }
						<ChevronDown
							className={ `h-4 w-4 transition-transform duration-200 ${ isOpen.value ? "rotate-180 text-foreground" : "" }` }
						/>
					</div>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="px-4 py-4 flex flex-col gap-4 border-t max-h-100 overflow-y-auto">
					{ isLoading && (
						<div className="text-sm text-muted-foreground py-4">{ t("filter.loadingFields") }</div>
					) }

					{ hasError && (
						<div className="text-sm text-destructive py-4">{ t("filter.loadFieldsError") }</div>
					) }

					{ isLoaded && groups.value.map((group, groupIndex) => (
						<GroupRow
							key={ group.id.value || `group-${ groupIndex }` }
							group={ group }
							totalGroups={ groups.value.length }
							fieldOptions={ fieldOptions }
							getFieldMeta={ getFieldMeta }
							onFieldChange={ onFieldChange }
							onOperatorChange={ onOperatorChange }
							onAddRule={ () => addRule(group) }
							onRemoveRule={ (ruleIndex) => removeRule(groupIndex, ruleIndex) }
							onRemoveGroup={ () => removeGroup(groupIndex) }
							renderCustomInput={ renderCustomInput }
						/>
					)) }

					{ isLoaded && (
						<div className="flex items-center justify-between">
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={ groups.value.length >= MAX_GROUPS }
								onClick={ addGroup }
							>
								<Plus className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1"/>
								{ t("filter.addGroup") }
							</Button>

							<div className="flex gap-2">
								<Button type="button" variant="ghost" size="sm" onClick={ handleClear }>
									{ t("filter.clear") }
								</Button>
								<Button type="button" size="sm" onClick={ handleApply }>
									{ t("filter.apply") }
								</Button>
							</div>
						</div>
					) }
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

function GroupRow(
	{
		group,
		totalGroups,
		fieldOptions,
		getFieldMeta,
		onFieldChange,
		onOperatorChange,
		onAddRule,
		onRemoveRule,
		onRemoveGroup,
		renderCustomInput
	}: {
		group: FilterGroup;
		totalGroups: number;
		fieldOptions: { label: string; value: string; }[];
		getFieldMeta: (propertyName: string) => FilterFieldMetadataDto | undefined;
		onFieldChange: (rule: FilterRule, propertyName: string) => void;
		onOperatorChange: (rule: FilterRule, operator: FilterOperator) => void;
		onAddRule: () => void;
		onRemoveRule: (ruleIndex: number) => void;
		onRemoveGroup: () => void;
		renderCustomInput?: (props: FilterValueInputProps) => React.ReactNode | undefined;
	}
)
{
	useSignals();
	const {t} = useTranslation("common");

	return (
		<div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-semibold text-muted-foreground uppercase">
					{ t("filter.group") }
				</span>
				{ totalGroups > 1 && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-6 px-2 text-xs text-destructive"
						onClick={ onRemoveGroup }
					>
						<X className="h-3 w-3 ltr:mr-1 rtl:ml-1"/>
						{ t("filter.removeGroup") }
					</Button>
				) }
			</div>

			{ group.rules.value.map((rule, ruleIndex) => (
				<RuleRow
					key={ `${ rule.id.value || ruleIndex }-${ rule.field.value }` }
					rule={ rule }
					fieldOptions={ fieldOptions }
					fieldMeta={ getFieldMeta(rule.field.value) }
					onFieldChange={ (propertyName) => onFieldChange(rule, propertyName) }
					onOperatorChange={ (operator) => onOperatorChange(rule, operator) }
					onRemove={ () => onRemoveRule(ruleIndex) }
					canRemove={ group.rules.value.length > 1 || totalGroups > 1 }
					renderCustomInput={ renderCustomInput }
				/>
			)) }

			<Button
				type="button"
				variant="outline"
				size="sm"
				className="self-start"
				disabled={ group.rules.value.length >= MAX_RULES_PER_GROUP }
				onClick={ onAddRule }
			>
				<Plus className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1"/>
				{ t("filter.addRule") }
			</Button>
		</div>
	);
}

function RuleRow(
	{rule, fieldOptions, fieldMeta, onFieldChange, onOperatorChange, onRemove, canRemove, renderCustomInput}: {
		rule: FilterRule;
		fieldOptions: { label: string; value: string; }[];
		fieldMeta?: FilterFieldMetadataDto;
		onFieldChange: (propertyName: string) => void;
		onOperatorChange: (operator: FilterOperator) => void;
		onRemove: () => void;
		canRemove: boolean;
		renderCustomInput?: (props: FilterValueInputProps) => React.ReactNode | undefined;
	}
)
{
	useSignals();
	const {t} = useTranslation("common");

	const operatorOptions = (fieldMeta?.filterOperators ?? []).map((o) => ({
		label: o.localizedName,
		value: o.operator
	}));

	return (
		<div className="flex flex-wrap items-start gap-2">
			<div className="w-48">
				<SelectField
					value={ rule.field as unknown as Signal<string | undefined> }
					options={ fieldOptions }
					placeholder={ t("filter.selectField") }
					onValueChange={ (v) => v && onFieldChange(v) }
				/>
			</div>

			<div className="w-44">
				<SelectField
					value={ rule.operator as unknown as Signal<FilterOperator | undefined> }
					options={ operatorOptions }
					placeholder={ t("filter.selectOperator") }
					disabled={ !fieldMeta }
					onValueChange={ (v) => v && onOperatorChange(v) }
				/>
			</div>

			<div className="flex-1 min-w-48">
				{ fieldMeta && <ValueInput rule={ rule } field={ fieldMeta } renderCustomInput={ renderCustomInput }/> }
			</div>

			{ canRemove && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-9 w-9 text-destructive shrink-0"
					onClick={ onRemove }
				>
					<Trash2 className="h-4 w-4"/>
				</Button>
			) }
		</div>
	);
}

function ValueInput(
	{rule, field, renderCustomInput}: FilterValueInputProps & {
		renderCustomInput?: (props: FilterValueInputProps) => React.ReactNode | undefined;
	}
)
{
	useSignals();
	const {t} = useTranslation("common");

	const custom = renderCustomInput?.({rule, field});
	if (custom !== undefined) return <>{ custom }</>;

	const isArrayOp = rule.operator.value === FilterOperator.Includes || rule.operator.value === FilterOperator.NotIncludes;

	if (isArrayOp)
	{
		const arrayValue = Array.isArray(rule.value.value) ? rule.value.value : [];
		return (
			<TextField
				value={ arrayValue.join(", ") }
				placeholder={ t("filter.commaSeparatedPlaceholder") }
				onChange={ (raw) =>
				{
					rule.value.value = raw
						.split(",")
						.map((s) => s.trim())
						.filter((s) => s.length > 0)
						.map((s) => (isNaN(Number(s)) ? s : Number(s)));
				} }
			/>
		);
	}

	if (field.type === FilterFieldType.Number || field.type === FilterFieldType.FK)
	{
		// Clean the string "" reset value to undefined so NumberField starts cleanly
		if (rule.value.value === "")
		{
			rule.value.value = undefined;
		}

		// Directly use your NumberField and bypass TypeScript's strict union complaint
		return (
			<NumberField
				value={ rule.value as unknown as Signal<number | undefined> }
				onChange={ (v) => rule.value.value = v ?? "" }
			/>
		);
	}

	if (field.type === FilterFieldType.Date)
	{
		return <DateFilterInput rule={ rule }/>;
	}

	return (
		<TextField
			value={ typeof rule.value.value === "string" ? rule.value.value : "" }
			onChange={ (v) => rule.value.value = v }
		/>
	);
}

function DateFilterInput({rule}: { rule: FilterValueInputProps["rule"] })
{
	useSignals();

	const dateSignal = useMemo(() =>
	{
		const val = rule.value.value;
		if (typeof val === "string" && val !== "")
		{
			const parsed = new Date(val);
			return signal(!isNaN(parsed.getTime()) ? parsed : undefined);
		}
		return signal<Date | undefined>(undefined);
	}, [rule]);

	useEffect(() =>
	{
		if (rule.value.value === "" || rule.value.value === null)
		{
			dateSignal.value = undefined;
		}
	}, [rule.value.value, dateSignal]);

	return (
		<DateInput
			value={ dateSignal }
			onChange={ (date) =>
			{
				if (!date)
				{
					rule.value.value = "";
				}
				else
				{
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, "0");
					const day = String(date.getDate()).padStart(2, "0");
					rule.value.value = `${ year }-${ month }-${ day }`;
				}
			} }
		/>
	);
}