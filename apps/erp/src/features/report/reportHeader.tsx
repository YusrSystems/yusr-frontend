import { type ComponentProps, type PropsWithChildren } from "react";
import { Card, cn } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";


export default function ReportHeader({children}: PropsWithChildren)
{
	return (
		<div
			className="grid grid-cols-3 p-3 rounded-md items-center gap-5 bg-accent">
			{ children }
		</div>
	);
}

ReportHeader.CompanySection = function CompanyCard({className, ...props}: ComponentProps<typeof Card>)
{
	useSignals();

	return (
		<div className={ cn("flex items-center gap-4", className) } { ...props }>
			<div
				className="w-20 h-20 shrink-0 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
				{ Services.auth.setting?.logo.value?.url ? (
					<img
						src={ Services.auth.setting?.logo.value.url }
						alt="Company Logo"
						className="w-full h-full object-contain"
					/>
				) : (
					<span
						className="text-2xl font-bold text-muted-foreground">{ Services.auth.setting?.companyName.value.at(0) }
					</span>
				) }
			</div>

			<div className="flex flex-col text-[10px] text-muted-foreground">
				<h3 className="font-bold text-lg text-primary mb-1">{ Services.auth.setting?.companyName.value }</h3>
				<p>{ Services.auth.setting?.vatNumber.value }</p>
				<p>
					{ Services.auth.setting?.branch.value?.cityName.value } - { Services.auth.setting?.branch.value?.district.value } - { Services.auth.setting?.branch.value?.postalCode.value }
				</p>
				<p>{ Services.auth.setting?.companyPhone.value }</p>
			</div>
		</div>
	);
};

ReportHeader.TitleSection = function Title({titleAr, titleEn, children}: {
	titleAr: string,
	titleEn: string
} & PropsWithChildren)
{
	return (
		<div className="flex flex-col gap-1 text-center h-full w-full">
			<h1 className="text-lg font-extrabold tracking-tight text-primary uppercase">
				{ titleAr }
			</h1>
			<h2 className="text-lg font-extrabold tracking-tight text-primary uppercase">
				{ titleEn }
			</h2>
			{ children }
		</div>
	);
};

ReportHeader.Id = function Title({id}: { id: number })
{
	return (
		<p className="text-destructive font-bold">{ id }</p>
	);
};

ReportHeader.MetaDataSection = function MetaData({children}: PropsWithChildren)
{
	return (
		<div className="h-full relative ">
			{ children }
			<div className="absolute bottom-0 w-full flex justify-end gap-4 text-[10px] text-foreground">
				<span>{ Services.auth.loggedInUser?.username.value }</span>
				<span>{ new Date().toDateString() }</span>
			</div>
		</div>
	);
};

