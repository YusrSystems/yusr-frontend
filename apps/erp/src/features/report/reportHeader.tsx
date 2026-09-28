import { type ComponentProps, type PropsWithChildren, useEffect, useRef } from "react";
import { Card, cn } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";
import { formatDate } from "@/features/report/utils/formating.ts";


export default function ReportHeader({children}: PropsWithChildren)
{
	return (
		<div
			className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 p-3 rounded-md items-center gap-3 sm:gap-5 print:gap-5 bg-accent">
			{ children }
		</div>
	);
}

ReportHeader.CompanySection = function CompanyCard({className, ...props}: ComponentProps<typeof Card>)
{
	useSignals();
	return (
		<div className={ cn("flex items-center gap-3 sm:gap-4 print:gap-4", className) } { ...props }>
			<div
				className="w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 shrink-0 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
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
			<div className="flex flex-col text-[10px] text-muted-foreground min-w-0">
				<h3 className="font-bold text-base sm:text-lg print:text-lg text-primary mb-0.5 sm:mb-1 truncate">{ Services.auth.setting?.companyName.value }</h3>
				<p className="truncate">{ Services.auth.setting?.vatNumber.value }</p>
				<p className="truncate">
					{ Services.auth.setting?.branch.value?.cityName.value } - { Services.auth.setting?.branch.value?.district.value } - { Services.auth.setting?.branch.value?.postalCode.value }
				</p>
				<p className="truncate">{ Services.auth.setting?.companyPhone.value }</p>
			</div>
		</div>
	);
};

ReportHeader.TitleSection = function Title({titleAr, titleEn, children}: {
	titleAr?: string,
	titleEn?: string
} & PropsWithChildren)
{
	return (
		<div className="flex flex-col gap-1 text-center h-full w-full justify-center">
			<h1 className="text-base sm:text-lg print:text-lg font-extrabold tracking-tight text-primary uppercase">
				{ titleAr }
			</h1>
			<h2 className="text-base sm:text-lg print:text-lg font-extrabold tracking-tight text-primary uppercase">
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
	const dateRef = useRef<HTMLSpanElement>(null);
	const initialDate = formatDate(new Date());

	useEffect(() =>
	{
		const handleBeforePrint = () =>
		{
			const freshDate = formatDate(new Date());
			if (dateRef.current)
			{
				dateRef.current.textContent = freshDate;
			}
		};
		window.addEventListener("beforeprint", handleBeforePrint);
		return () =>
		{
			window.removeEventListener("beforeprint", handleBeforePrint);
		};
	}, []);

	return (
		<div className="h-full relative min-h-[40px] sm:min-h-0">
			{ children }
			<div
				className="sm:absolute sm:bottom-0 print:absolute print:bottom-0 w-full flex justify-end gap-3 sm:gap-4 print:gap-4 text-[10px] text-foreground">
				<span>{ Services.auth.loggedInUser?.username.value }</span>
				<span ref={ dateRef }>{ initialDate }</span>
			</div>
		</div>
	);
};