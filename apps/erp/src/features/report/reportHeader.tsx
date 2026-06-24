import { type ComponentProps, type PropsWithChildren, useMemo } from "react";
import { Card, cn } from "yusr-ui";
import { type Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


export default function ReportHeader({children}: PropsWithChildren)
{
	return (
		<div
			className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:flex-row print:items-center">
			{ children }
		</div>
	);
}

export type CompanyCardProps = ComponentProps<typeof Card> & {
	logoUrl?: string;
};

ReportHeader.CompanyCard = function CompanyCard({className, logoUrl, ...props}: CompanyCardProps)
{
	useSignals();
	const isImageError: Signal<boolean> = useMemo(() => signal<boolean>(false), []);
	return (
		<div className={ cn("flex items-center gap-4", className) } { ...props }>
			<div
				className="w-16 h-16 shrink-0 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center print:border-black/20">
				{ !isImageError.value && logoUrl ? (
					<img
						src={ logoUrl }
						alt="Company Logo"
						className="w-full h-full object-contain"
						onError={ () => isImageError.value = true }
					/>
				) : (
					<span className="text-2xl font-bold text-muted-foreground print:text-black/50">Y</span>
				) }
			</div>

			<div className="flex flex-col text-sm text-muted-foreground print:text-black/80">
				<h5 className="font-bold text-xl text-foreground print:text-black mb-1">Yusr</h5>
				<p>الرقم الضريبي: 2323233232323323</p>
				<p>قباء - المحبوبة - 1234 - 34343</p>
				<p>0534924601</p>
			</div>
		</div>
	);
};

ReportHeader.Title = function Title()
{
	return (
		<div className="text-center flex-1">
			<h1 className="text-3xl font-extrabold tracking-tight text-foreground print:text-black uppercase">
				Invoice Report
			</h1>
			<p className="text-muted-foreground text-sm mt-1 print:text-black/70">Monthly Summary</p>
		</div>
	);
};

ReportHeader.MetaData = function MetaData()
{
	return (
		<div className="flex flex-col text-right text-sm bg-muted/50 print:bg-transparent p-3 rounded-md print:p-0">
			<div className="flex justify-between gap-4">
				<span className="font-medium text-muted-foreground print:text-black/70">Prepared By:</span>
				<span className="font-semibold text-foreground print:text-black">Hbraa</span>
			</div>
			<div className="flex justify-between gap-4 mt-1">
				<span className="font-medium text-muted-foreground print:text-black/70">Date:</span>
				<span className="font-semibold text-foreground print:text-black">2026/06/24</span>
			</div>
		</div>
	);
};

