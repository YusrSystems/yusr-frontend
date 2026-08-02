import type { PropsWithChildren } from "react";


export function SummaryRow({className, children}: { className?: string } & PropsWithChildren)
{
	return (
		<div className={ `flex items-center px-1.5 py-1 ${ className }` }>
			{ children }
		</div>
	);
}

SummaryRow.Label = function ({label, className}: { label: string; className?: string })
{
	return (
		<h4 className={ `text-sm font-bold max-w-50 w-50 ${ className }` }>{ label }</h4>
	);
};

SummaryRow.Value = function ({value, className}: { value: string; className?: string })
{
	return (
		<h3 className={ `flex-1 text-center font-bold ${ className }` }>
			{ value }
		</h3>
	);
};