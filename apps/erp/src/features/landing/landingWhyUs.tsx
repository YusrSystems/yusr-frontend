import {
	ArrowLeft,
	Globe,
	HelpCircle,
	type LucideProps,
	RefreshCw,
	Rocket,
	ShieldCheck,
	Tags,
	Timer
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Card } from "yusr-ui";
import React from "react";


const iconMap: Record<
	string,
	React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
> = {
	HelpCircle,
	ShieldCheck,
	Rocket,
	Timer,
	Globe,
	RefreshCw,
	Tags
};

export default function LandingWhyUs()
{
	const {t, i18n} = useTranslation("landing");
	const {t: tCommon} = useTranslation("common");
	const whyUsItems = t("whyUs.items", {returnObjects: true}) as {
		icon: string;
		title: string;
		desc: string;
	}[];

	return (
		<section id="why-us" dir={ i18n.dir() } className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
			<div className="mb-8 sm:mb-12 text-center">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{ t("whyUs.title") }</h2>
				<p className="mt-3 sm:mt-5 text-sm sm:text-base text-muted-foreground">
					{ t("whyUs.description") }
				</p>
			</div>
			<div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{ whyUsItems.map((w, i) =>
				{
					const Icon = iconMap[w.icon]!;
					return (
						<Card
							key={ i }
							className="flex gap-4 p-4 sm:p-6 transition-all duration-200 hover:bg-accent hover:border-primary/30"
						>
							<div
								className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<Icon className="h-5 w-5"/>
							</div>
							<div>
								<h3 className="text-sm sm:text-base font-bold">{ w.title }</h3>
								<p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{ w.desc }</p>
							</div>
						</Card>
					);
				}) }
			</div>

			<div className="mt-8 sm:mt-12 rounded-2xl border border-primary/20 bg-card p-5 sm:p-8 text-center">
				<p className="text-lg sm:text-2xl font-bold text-primary">
					{ t("whyUs.cta.title") }
				</p>
				<p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
					{ t("whyUs.cta.description") }
				</p>
				<Link to="/register">
					<Button className="mt-4 sm:mt-6 gap-2 px-6 sm:px-8 shadow-md shadow-primary/20 text-sm sm:text-base"
					        size="lg">
						{ tCommon("register") }
						<ArrowLeft className="h-4 w-4 ltr:rotate-180"/>
					</Button>
				</Link>
			</div>
		</section>
	);
}