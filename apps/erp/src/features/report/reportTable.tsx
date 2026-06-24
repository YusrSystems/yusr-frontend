import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "yusr-ui";


export default function ReportTable()
{
	return (
		<Table className="w-full">
			<TableCaption className="mb-4 text-muted-foreground print:text-black/70 print:mb-2">
				A list of your recent invoices.
			</TableCaption>
			<TableHeader className="bg-muted/50 print:bg-black/5">
				<TableRow className="hover:bg-transparent border-border print:border-black/20">
					<TableHead className="w-25 font-bold text-foreground print:text-black">Invoice</TableHead>
					<TableHead className="font-bold text-foreground print:text-black">Status</TableHead>
					<TableHead className="font-bold text-foreground print:text-black">Method</TableHead>
					<TableHead className="text-right font-bold text-foreground print:text-black">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className="border-border print:border-black/20 print:break-inside-avoid">
					<TableCell className="font-medium text-foreground print:text-black">INV001</TableCell>
					<TableCell>
 						<span
							className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground print:border print:border-black/30 print:bg-transparent print:text-black">
							Paid
						</span>
					</TableCell>
					<TableCell className="text-muted-foreground print:text-black/80">Credit Card</TableCell>
					<TableCell className="text-right font-medium text-foreground print:text-black">$250.00</TableCell>
				</TableRow>

				<TableRow className="border-border print:border-black/20 print:break-inside-avoid">
					<TableCell className="font-medium text-foreground print:text-black">INV002</TableCell>
					<TableCell>
						<span
							className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground print:border print:border-black/30 print:bg-transparent print:text-black">
							Pending
						</span>
					</TableCell>
					<TableCell className="text-muted-foreground print:text-black/80">Bank Transfer</TableCell>
					<TableCell className="text-right font-medium text-foreground print:text-black">$1,250.00</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
