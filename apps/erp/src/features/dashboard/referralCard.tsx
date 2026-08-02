import { Card, CardContent, cn, Progress } from "yusr-ui";
import { useTranslation } from "react-i18next";
import { Services } from "@/core/services/services.ts";


const REFERRAL_TIERS = [
	{
		count: 0,
		name: "مُنطلق",
		discount: "0%",
		badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
		progressClass: "bg-slate-500 dark:bg-slate-400"
	},
	{
		count: 1,
		name: "مُيسِّر",
		discount: "10%",
		badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
		progressClass: "bg-blue-500 dark:bg-blue-400"
	},
	{
		count: 2,
		name: "مُيسِّر",
		discount: "20%",
		badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
		progressClass: "bg-blue-500 dark:bg-blue-400"
	},
	{
		count: 3,
		name: "مُعاوِن",
		discount: "30%",
		badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
		progressClass: "bg-indigo-500 dark:bg-indigo-400"
	},
	{
		count: 4,
		name: "مُعاوِن",
		discount: "40%",
		badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
		progressClass: "bg-indigo-500 dark:bg-indigo-400"
	},
	{
		count: 5,
		name: "ثِقة",
		discount: "50%",
		badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
		progressClass: "bg-amber-500 dark:bg-amber-400"
	},
	{
		count: 6,
		name: "ثِقة",
		discount: "60%",
		badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
		progressClass: "bg-amber-500 dark:bg-amber-400"
	},
	{
		count: 7,
		name: "ركيزة",
		discount: "70%",
		badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
		progressClass: "bg-orange-500 dark:bg-orange-400"
	},
	{
		count: 8,
		name: "ركيزة",
		discount: "80%",
		badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
		progressClass: "bg-orange-500 dark:bg-orange-400"
	},
	{
		count: 9,
		name: "عِماد",
		discount: "90%",
		badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
		progressClass: "bg-rose-500 dark:bg-rose-400"
	},
	{
		count: 10,
		name: "سفير يُسر",
		discount: "100%",
		badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
		progressClass: "bg-emerald-500 dark:bg-emerald-400"
	}
] as const;

export default function ReferralCard()
{
	const {i18n} = useTranslation("erpCommon");
	const isRtl = i18n.dir() === "rtl";
	const referralsCount = Services.auth.setting?.referralsCount.value ?? 0;

	const currentTier = REFERRAL_TIERS[Math.min(referralsCount, 10)]!;
	const nextTier = referralsCount < 10 ? REFERRAL_TIERS[referralsCount + 1] : null;
	const isMaxLevel = referralsCount >= 10;

	const progressValue = Math.min(referralsCount * 10, 100);

	return (
		<Card dir={ i18n.dir() } className="w-full">
			<CardContent className="py-3 flex flex-col sm:flex-row items-center gap-4">

				<div className={ cn(
					"flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 shrink-0 min-w-35",
					currentTier.badgeClass
				) }>
					<span className="text-sm font-bold">{ currentTier.name }</span>
					<span className="text-xs font-semibold bg-background/50 px-1.5 py-0.5 rounded text-inherit">
						خصم { currentTier.discount }
					</span>
				</div>

				<div className="flex-1 w-full flex flex-col justify-center gap-2 mt-1 sm:mt-0">

					<div className="flex justify-between items-end px-1 text-sm">

						<div className="text-muted-foreground">
							{ isMaxLevel ? (
								<span className="text-emerald-600 dark:text-emerald-400 font-bold">اشتراكك الآن مجاني تماماً!</span>
							) : (
								<>
									انضم <strong className="text-foreground">{ referralsCount }
								</strong> عملاء إلى يُسر بترشيحك.
									تبقى <strong className="text-foreground">1</strong> للترقية.
								</>
							) }
						</div>

						{ !isMaxLevel && nextTier && (
							<div className="text-xs font-medium text-muted-foreground text-left">
								القادم: <span className="font-bold">{ nextTier.name }</span> ({ nextTier.discount })
							</div>
						) }
					</div>

					<Progress
						value={ progressValue }
						className={ cn(
							"h-2 bg-secondary",
							isRtl && "scale-x-[-1]"
						) }
						indicatorClassName={ currentTier.progressClass }
					/>
				</div>

			</CardContent>
		</Card>
	);
}