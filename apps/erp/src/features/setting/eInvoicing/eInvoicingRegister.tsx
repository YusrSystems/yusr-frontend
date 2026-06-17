import { type EInvoicingEnvironmentType, Setting } from "@/core/data/setting";
import EInvoicingApiService from "@/core/networking/eInvoicingApiService";
import { Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardContent, OtpInput } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


interface EInvoicingRegisterProps
{
	linkType: EInvoicingEnvironmentType;
	onFinish?: () => void;
	formData: Setting;
}

export function EInvoicingRegister({linkType, onFinish, formData}: EInvoicingRegisterProps)
{
	useSignals();
	const {t} = useTranslation("erpCommon");
	const otp = signal<string>("");
	const isLoading = signal<boolean>(false);

	const handleLink = async () =>
	{
		if (otp.value.length !== 6 || isLoading.value)
		{
			return;
		}

		isLoading.value = true;

		const res = await new EInvoicingApiService().Link(otp.value, linkType);

		if (res.status === 200)
		{
			onFinish?.();
			formData.eInvoicingEnvironmentType.value = linkType;
		}
		isLoading.value = false;
	};

	return (
		<div dir="rtl" className="flex flex-col items-center gap-8 py-6">
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 dark:bg-green-950">
					<ShieldCheck className="w-7 h-7 text-green-600 dark:text-green-400"/>
				</div>
				<div>
					<h2 className="text-xl font-semibold text-foreground">{ t("settings.linkZatca") }</h2>
					<p className="text-sm text-muted-foreground mt-1">{ t("settings.enterVerificationCode") }</p>
				</div>
			</div>

			<Card className="w-full">
				<CardContent className="flex flex-col items-center gap-6 pt-6">
					<OtpInput value={ otp.value } onChange={ (val) => otp.value = val } disabled={ isLoading.value }/>

					<Button
						type="button"
						onClick={ handleLink }
						disabled={ otp.value.length !== 6 || isLoading.value }
						className="w-full rounded-xl h-11"
					>
						{ isLoading
							? (
								<>
									<Loader2 className="ml-2 h-4 w-4 animate-spin"/> { t("settings.linking") }
								</>
							)
							: t("settings.startLinking") }
					</Button>
				</CardContent>
			</Card>

			<div className="flex flex-col items-center gap-1 text-center text-sm text-muted-foreground">
				<p>{ t("settings.noCode") }</p>
				<p>{ t("settings.visitZatca") }</p>
				<a
					href="https://login.zatca.gov.sa"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 dark:text-blue-400 underline underline-offset-4 mt-1"
				>
					login.zatca.gov.sa
				</a>
			</div>
		</div>
	);
}
