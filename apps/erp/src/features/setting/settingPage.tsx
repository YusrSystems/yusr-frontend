import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Building2, Loader2, Receipt, Wallet } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardContent, CardFooter, StorageType, TabButton, useStorageFile } from "yusr-ui";
import BasicSection from "./basicSection";
import DefaultsSection from "./defaultsSection";
import InvoiceSection from "./invoiceSection";
import SettingsCubit from "@/features/setting/logic/settingsCubit.ts";
import { SettingsLoading, SettingsSaving } from "@/features/setting/logic/settingsState.ts";


export default function SettingPage()
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	const {commitFiles} = useStorageFile(
		() => Services.auth?.setting?.logo?.value ? [Services.auth?.setting?.logo.value] : [],
		(files) =>
		{
			const file = Array.isArray(files)
				? files[0]
				: files;

			if (Services.auth?.setting?.logo && file)
			{
				Services.auth.setting.logo.value = file;
			}
		},
		StorageType.Public,
		false
	);
	const cubit = useMemo(() => new SettingsCubit(), []);
	useEffect(() =>
	{
		void cubit.init();
	}, [cubit]);

	async function Save()
	{

		const resolvedLogo = await commitFiles(
			cubit.formData.logo?.value,
			`Logos`
		);
		const updatedLogo = resolvedLogo[0];

		if (cubit.formData.logo && updatedLogo)
		{
			cubit.formData.logo.value = updatedLogo;
		}
	}

	if (cubit.state.value instanceof SettingsLoading)
	{
		return (
			<div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin text-primary mb-4"/>
				{ t("settings.loading") }
			</div>
		);
	}

	const isLoading = cubit.state.value instanceof SettingsSaving;

	return (
		<div className="container mx-auto px-5 pb-8 max-w-5xl">
			<div className="mb-5 text-center">
				<h1 className="text-3xl font-bold tracking-tight">{ t("settings.title") }</h1>
				<p className="text-muted-foreground mt-2">{ t("settings.subtitle") }</p>
			</div>

			<Card className="relative shadow-lg border-muted/40 py-0">
				<div className="flex border-b bg-muted/10 rounded-t-xl overflow-x-auto">
					<TabButton
						active={ cubit.activeTab.value === "basic" }
						icon={ Building2 }
						label={ t("settings.basicData") }
						onClick={ () => cubit.activeTab.value = "basic" }
						content={ <></> }
					/>
					<TabButton
						active={ cubit.activeTab.value === "invoicing" }
						icon={ Receipt }
						label={ t("settings.invoicesAndTaxes") }
						onClick={ () => cubit.activeTab.value = "invoicing" }
						content={ <></> }
					/>
					<TabButton
						active={ cubit.activeTab.value === "accounts" }
						icon={ Wallet }
						label={ t("settings.defaultAccounts") }
						onClick={ () => cubit.activeTab.value = "accounts" }
						content={ <></> }
					/>
				</div>

				<CardContent className="py-3 min-h-[50vh]">
					{ cubit.activeTab.value === "basic" && <BasicSection formData={ cubit.formData }/> }
					{ cubit.activeTab.value === "invoicing" && <InvoiceSection formData={ cubit.formData }/> }
					{ cubit.activeTab.value === "accounts" && <DefaultsSection formData={ cubit.formData }/> }
				</CardContent>

				<CardFooter className="flex justify-end border-t pt-4">
					<Button disabled={ isLoading } size="lg" className="px-12 font-bold text-md shadow-lg"
					        onClick={ async () =>
							{
								await Save();
								await cubit.save();
							} }>
						{ isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin"/> }
						{ t("settings.save") }
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
