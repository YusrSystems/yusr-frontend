import type { PropsWithChildren } from "react";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function ReportPage({children}: PropsWithChildren)
{
	const {t} = useTranslation("common");
	return (
		<div className="flex flex-col h-[calc(100vh-70px)] print:h-auto max-w-5xl w-full mx-auto pb-6 px-4 print:p-0">

			<div className="mb-6 flex justify-end print:hidden">
				<button
					onClick={ () => window.print() }
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
				>
					<Printer className="me-3"/>
					{ t("printReport") }
				</button>
			</div>

			{ children }

		</div>
	);
}