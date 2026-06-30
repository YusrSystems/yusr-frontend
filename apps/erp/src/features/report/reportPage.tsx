import type { PropsWithChildren } from "react";


export default function ReportPage({children}: PropsWithChildren)
{
	return (
		<div className="min-h-screen p-4 md:p-8 flex flex-col print:overflow-visible" id="print-report">

			<style>{ `
				@media print {
					@page { 
						margin: 3mm 3mm 12mm 3mm; 
					}
					body { 
						-webkit-print-color-adjust: exact !important; 
						print-color-adjust: exact !important; 
					}
				}
			` }</style>

			<div className="mb-6 flex justify-end print:hidden">
				<button
					onClick={ () => window.print() }
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
				>
					Print Report
				</button>
			</div>

			{ children }

		</div>
	);
}