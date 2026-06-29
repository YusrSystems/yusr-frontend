import { useTranslation } from "react-i18next";
import type { Setting } from "@/core/data/setting.ts";
import { EInvoicingEnvironmentType } from "@/core/data/setting.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { EInvoicingRegisterButton } from "@/features/setting/eInvoicing/eInvoicingRegisterButton.tsx";


export default function EInvoiceSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	return (
		<div className="space-y-10 animate-in fade-in">
			<EInvoicingRegisterButton
				formData={ formData }
				title="Testing"
				subtitle="sandbox"
				linkType={ EInvoicingEnvironmentType.Test }
			/>

			<EInvoicingRegisterButton
				formData={ formData }
				title="Fatoora Simulation"
				subtitle={ t("settings.simulationSubtitle") }
				linkType={ EInvoicingEnvironmentType.Simulation }
			/>

			<EInvoicingRegisterButton
				formData={ formData }
				title="Fatoora Portal"
				subtitle={ t("settings.productionSubtitle") }
				linkType={ EInvoicingEnvironmentType.Production }
			/>
		</div>
	);
}
