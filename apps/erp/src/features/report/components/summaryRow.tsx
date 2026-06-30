import type { PropsWithChildren } from "react";


export function SummaryRow({className, children}: { className?: string } & PropsWithChildren)
{
	return (
		<div className={ `flex items-center px-1.5 py-0.5 ${ className }` }>
			{ children }
		</div>
	);
}

SummaryRow.Label = function ({label, className}: { label: string; className?: string })
{
	return (
		<p className={ `text-sm font-bold ${ className }` }>{ label }</p>
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