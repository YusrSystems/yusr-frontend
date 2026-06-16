import logoDark from "@/assets/yusrLogoOnly_Dark.png";
import logoLight from "@/assets/yusrLogoOnly_Light.png";
import SettingsApiServiceOld from "@/core/networking/settingsApiServiceOld.ts";
import { Building2, FileText, Globe, Hash, Home, MailOpen, MapPin, Navigation, Phone, Receipt } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Badge, CopyButton, LanguageToggle, Separator, ThemeToggle } from "yusr-ui";
import type { SharingSetting } from "@/core/data/setting.ts";


interface FieldRowProps
{
	icon: React.ReactNode;
	label: string;
	value?: string | null;
}

function FieldRow({icon, label, value}: FieldRowProps)
{
	return (
		<div
			className="group flex items-start gap-3 py-2.5 px-1 rounded-lg hover:bg-muted/50 transition-colors duration-150">
      <span className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5">
        { icon }
      </span>
			<span className="text-sm text-muted-foreground w-35 shrink-0">{ label }</span>
			<h3 className="text-sm flex-1 font-medium break-all" title={ value ?? "-" }>
				{ value ?? "-" }
			</h3>
			{ value && <CopyButton value={ value }/> }
		</div>
	);
}

function SectionCard({
	title,
	children
}: {
	title: string;
	children: React.ReactNode;
})
{
	return (
		<div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
			<div className="px-4 pt-4 pb-2">
				<p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
					{ title }
				</p>
			</div>
			<Separator/>
			<div className="px-3 py-2">{ children }</div>
		</div>
	);
}

function Skeleton({className}: { className?: string; })
{
	return (
		<div
			className={ `animate-pulse rounded-md bg-muted ${ className ?? "" }` }
		/>
	);
}

function LoadingSkeleton()
{
	return (
		<div className="max-w-md mx-auto p-5 space-y-5" dir="rtl">
			<div className="flex flex-col items-center gap-3 pt-4">
				<Skeleton className="w-24 h-24 rounded-full"/>
				<Skeleton className="w-40 h-5 rounded"/>
				<Skeleton className="w-24 h-4 rounded"/>
			</div>
			<Skeleton className="h-40 rounded-2xl"/>
			<Skeleton className="h-48 rounded-2xl"/>
		</div>
	);
}

export default function TenantInfoSharingPage()
{
	const {registrationKey} = useParams();
	const [initLoading, setInitLoading] = useState(true);
	const [setting, setSetting] = useState<SharingSetting>();
	const {t, i18n} = useTranslation("commonEntities");

	useEffect(() =>
	{
		if (!registrationKey)
		{
			return;
		}
		const fetch = async () =>
		{
			setInitLoading(true);
			const response = await new SettingsApiServiceOld().GetForSharing(registrationKey);
			if (response.data)
			{
				setSetting(response.data);
			}
			setInitLoading(false);
		};
		void fetch();
	}, [registrationKey]);

	if (initLoading)
	{
		return <LoadingSkeleton/>;
	}

	if (!setting)
	{
		return (
			<div className="min-h-screen flex items-center justify-center" dir="rtl">
				<div className="text-center space-y-2">
					<Building2 className="w-10 h-10 text-muted-foreground mx-auto"/>
					<p className="text-muted-foreground text-sm">{ t("sharing.tenantNotFound") }</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen bg-background"
			dir={ i18n.dir() }
		>
			<header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
				<div className="mx-auto flex gap-5 max-w-6xl items-center justify-between px-6 py-2">
					<a
						href="https://erp.yusrsys.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={ logoLight }
							alt="YusrLogo"
							className="block dark:hidden h-8 w-8 object-contain"
						/>
						<img
							src={ logoDark }
							alt="YusrLogo"
							className="hidden dark:block h-8 w-8 object-contain"
						/>
					</a>

					<div className="flex items-center gap-3">
						<ThemeToggle/>
						<LanguageToggle/>
					</div>
				</div>
			</header>
			<div className="flex items-center justify-center pt-3 px-3">
				<a
					href="https://erp.yusrsys.com"
					target="_blank"
					rel="noopener noreferrer"
					className="
            group inline-flex items-center gap-2
            rounded-full border
            border-border/60
            bg-blue-100/60
            px-4 py-1.5
            text-[14px] font-medium text-blue-600 text-center
            shadow-sm backdrop-blur
            transition-all duration-200
            hover:-translate-y-0.5
            hover:border-primary/30
            hover:bg-primary/10
            hover:text-primary
            hover:shadow-md
        "
				>
					<Globe className="h-4 w-4 transition-transform group-hover:rotate-12"/>

					<span>
            { t("sharing.promotionText") }
          </span>
				</a>
			</div>
			<div className="max-w-lg mx-auto px-4 py-3 space-y-5">
				<div className="flex flex-col items-center gap-3 pt-2 pb-2">
					{ setting.logo?.url
						? (
							<div className="relative">
								<div
									className="w-24 h-24 rounded-full border-2 border-border shadow-md overflow-hidden bg-muted">
									<img
										src={ setting.logo.url }
										alt={ setting.companyName }
										className="w-full h-full object-contain"
									/>
								</div>
							</div>
						)
						: (
							<div
								className="w-24 h-24 rounded-full border-2 border-border bg-muted flex items-center justify-center shadow-md">
								<Building2 className="w-10 h-10 text-muted-foreground"/>
							</div>
						) }

					<div className="text-center space-y-1">
						<h1 className="text-xl font-semibold tracking-tight">
							{ setting.companyName }
						</h1>
						{ setting.city?.country?.name && (
							<Badge variant="secondary" className="text-xs font-normal gap-1">
								<Globe className="w-3 h-3"/>
								{ setting.city.country.name }
							</Badge>
						) }
					</div>
				</div>

				<SectionCard title={ t("sharing.companyInfo") }>
					<FieldRow
						icon={ <Building2 className="w-4 h-4"/> }
						label={ t("sharing.companyName") }
						value={ setting.companyName }
					/>
					<FieldRow
						icon={ <Phone className="w-4 h-4"/> }
						label={ t("sharing.companyPhone") }
						value={ setting.companyPhone }
					/>
					<FieldRow
						icon={ <FileText className="w-4 h-4"/> }
						label={ t("sharing.crn") }
						value={ setting.crn }
					/>
					<FieldRow
						icon={ <Receipt className="w-4 h-4"/> }
						label={ t("sharing.vatNumber") }
						value={ setting.vatNumber }
					/>
				</SectionCard>

				<SectionCard title={ t("sharing.addressInfo") }>
					<FieldRow
						icon={ <Globe className="w-4 h-4"/> }
						label={ t("sharing.country") }
						value={ setting.city?.country?.name.value }
					/>
					<FieldRow
						icon={ <MapPin className="w-4 h-4"/> }
						label={ t("sharing.city") }
						value={ setting.city?.name }
					/>
					<FieldRow
						icon={ <Navigation className="w-4 h-4"/> }
						label={ t("sharing.district") }
						value={ setting.district }
					/>
					<FieldRow
						icon={ <Home className="w-4 h-4"/> }
						label={ t("sharing.street") }
						value={ setting.street }
					/>
					<FieldRow
						icon={ <MailOpen className="w-4 h-4"/> }
						label={ t("sharing.postalCode") }
						value={ setting.postalCode }
					/>
					<FieldRow
						icon={ <Hash className="w-4 h-4"/> }
						label={ t("sharing.buildingNumber") }
						value={ setting.buildingNumber }
					/>
				</SectionCard>

				<p className="text-center text-xs text-muted-foreground/50 pb-4">
					{ t("sharing.card") }
				</p>
			</div>
		</div>
	);
}
