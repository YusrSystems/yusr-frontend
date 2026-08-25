import { type Signal, useComputed } from "@preact/signals-react";
import type { PartnerDto } from "@/core/data/partner";
import { Services } from "@/core/services/services";


export interface InvoiceOriginInfo
{
	isCrossBorder: boolean;
	canBeExportInvoice: boolean;
	canBeImportInvoice: boolean;
}

export function useInvoiceOrigin(selectedPartner: Signal<PartnerDto | undefined>)
{
	return useComputed<InvoiceOriginInfo>(() =>
	{
		const partnerCountryId = selectedPartner.value?.city?.countryId;
		const settingsCountryId = Services.auth.setting?.branch?.value?.city.value?.countryId.value;

		if (partnerCountryId === undefined || settingsCountryId === undefined)
		{
			return {
				isCrossBorder: false,
				canBeExportInvoice: false,
				canBeImportInvoice: false
			};
		}

		const isCrossBorder = partnerCountryId !== settingsCountryId;
		return {
			isCrossBorder,
			canBeExportInvoice: isCrossBorder,
			canBeImportInvoice: isCrossBorder
		};
	});
}