import ReportHeader from "@/features/report/reportHeader.tsx";
import ReportFooter from "@/features/report/reportFooter.tsx";
import ReportTable from "@/features/report/reportTable.tsx";


export default function ReportPage()
{
	return (
		<div className="min-h-screen bg-muted/30 p-4 md:p-8 print:p-0 print:bg-white">

			<style>{ `
				@media print {
					@page { margin: 15mm; }
					body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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

			<div
				className="max-w-5xl mx-auto bg-card text-card-foreground shadow-sm border border-border rounded-lg p-6 md:p-10 print:shadow-none print:border-none print:p-0 print:max-w-full relative pb-20 print:bg-white print:text-black">

				<ReportHeader>
					<ReportHeader.CompanyCard logoUrl="/path-to-your-logo.png"/>
					<ReportHeader.Title/>
					<ReportHeader.MetaData/>
				</ReportHeader>

				<div className="my-8 border-t border-border print:border-black/20"/>

				<ReportTable/>

				<ReportFooter/>
			</div>
		</div>
	);
}
