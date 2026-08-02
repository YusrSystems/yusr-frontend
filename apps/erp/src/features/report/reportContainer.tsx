import type { PropsWithChildren } from "react";


export const PRINT_PORTAL_CLASS = "report-print-root";

interface ReportContainerProps extends PropsWithChildren
{
	isPortal?: boolean;
}

export function ReportContainer({children, isPortal = false}: ReportContainerProps)
{
	return (
		<div
			className="report flex-1 min-h-0 overflow-y-auto max-w-5xl w-full mx-auto bg-card text-card-foreground shadow-sm border border-border p-10 print:p-0
				print:shadow-none print:border-none print:max-w-none print:overflow-visible print:h-auto relative"
		>
			<style>{ `
             @media print {
                @page { 
                   margin: 5mm 5mm 12mm 5mm; 
                }
                html, body {
                   background-color: white !important;
                }
                body { 
                   -webkit-print-color-adjust: exact !important; 
                   print-color-adjust: exact !important; 
                }
                
                /* ONLY hide the background layout if this instance is running via portal */
                ${ isPortal ? `
                body > *:not(.report-print-root) {
					display: none !important;
				}
				
				body > .report-print-root {
					display: block !important;
				}
                ` : "" }
             }
          ` }</style>
			{ children }
		</div>
	);
}

export function PortalReportContainer({children}: PropsWithChildren)
{
	return <div className={ `hidden print:block print:w-full print:static ${ PRINT_PORTAL_CLASS }` }>
		{ children }
	</div>;
}