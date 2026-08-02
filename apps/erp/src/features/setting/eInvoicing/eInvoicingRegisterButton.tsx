import ZatcaLogo from "@/assets/Zatca_logo.png";
import { CircleCheck } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent } from "yusr-ui";
import { EInvoicingRegister } from "./eInvoicingRegister";
import type { EInvoicingEnvironmentType, Setting } from "@/core/data/setting.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";


interface EInvoicingRegisterButtonProps
{
	formData: Setting;
	title: string;
	subtitle: string;
	linkType: EInvoicingEnvironmentType;
}

export function EInvoicingRegisterButton({
	formData,
	title,
	subtitle,
	linkType
}: EInvoicingRegisterButtonProps)
{
	useSignals();
	const {t} = useTranslation("erpCommon");
	const isOpen = useMemo(() => signal(false), []);

	const handleFinish = () =>
	{
		isOpen.value = false;
		formData.eInvoicingEnvironmentType.value = linkType;
	};

	return (
		<>
			<div className="flex items-center rounded-2xl border bg-card p-4 shadow-sm">
				<img
					src={ ZatcaLogo }
					alt="ZatcaLogo"
					className="w-14 h-14 object-contain shrink-0"
				/>
				<div className="mx-6">
					<p className="text-xl font-semibold text-card-foreground">{ title }</p>
					<p className="text-sm text-muted-foreground">{ subtitle }</p>
				</div>
				<div className="ms-auto">
					{ formData.eInvoicingEnvironmentType.value === linkType
						? <CircleCheck className="text-green-600 dark:text-green-400"/>
						: <Button onClick={ () => isOpen.value = true }>{ t("settings.startLinking") }</Button> }
				</div>
			</div>

			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent className="max-w-xl">
					<EInvoicingRegister formData={ formData } linkType={ linkType } onFinish={ handleFinish }/>
				</DialogContent>
			</Dialog>
		</>
	);
}
