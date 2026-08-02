import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import type { FilterRule } from "./filterRule.ts";
import { signal, type Signal } from "@preact/signals-react";


type FilterLabelWrapperProps = {
	rule: FilterRule;
	children: (label: Signal<string | undefined>) => React.ReactNode;
};

export function FilterLabelWrapper({
	rule,
	children
}: FilterLabelWrapperProps)
{
	useSignals();

	const label = useMemo(() =>
	{
		const r = rule as FilterRule & {
			_uiLabel?: Signal<string | undefined>;
		};

		if (!r._uiLabel)
		{
			r._uiLabel = signal<string | undefined>(undefined);
		}

		return r._uiLabel;
	}, [rule]);

	useEffect(() =>
	{
		if (rule.value.value === "" || rule.value.value === null)
		{
			label.value = undefined;
		}
	}, [rule.value.value, label]);

	return <>{ children(label) }</>;
}