import Zatca_lg_dark from "@/assets/Zatca_lg_dark.webp";
import Zatca_lg_light from "@/assets/Zatca_lg_light.webp";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge, Button } from "yusr-ui";


export default function LandingHero()
{
	const {t} = useTranslation("landing");
	return (
		<section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24 pt-10 sm:pt-15 text-center">
			<Badge
				variant="secondary"
				className="
				mb-6 sm:mb-10
				rounded-full
				border-primary/20
				bg-primary/5
				text-xs sm:text-sm text-primary
				backdrop-blur-md
				transition-colors
				hover:bg-primary/10
				ltr:flex-row-reverse
				min-h-fit"
			>
				<span className="relative flex h-2 w-2">
					<span
						className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"/>
					<span className="relative inline-flex h-2 w-2 rounded-full bg-primary"/>
				</span>
				<span className="text-wrap">
					{ t("hero.badge") }
				</span>
			</Badge>

			<h1 className="text-3xl! sm:text-5xl! md:text-6xl! font-extrabold leading-[1.15] tracking-tighter">
				<span className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
					{ t("hero.title") }
				</span>
			</h1>

			<h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-primary">
				{ t("hero.subtitle") }
			</h2>

			<p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-medium leading-relaxed text-muted-foreground">
				{ t("hero.description") }
			</p>

			<div
				className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row ltr:flex-row-reverse w-full max-w-md mx-auto sm:max-w-none">
				<Button
					asChild
					size="lg"
					className="flex ltr:flex-row-reverse h-12 sm:h-14 rounded-full px-8 sm:px-10 text-base sm:text-lg shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
				>
					<Link to="/register">
						{ t("hero.cta_start") }
						<ArrowLeft className="ms-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform ltr:rotate-180"/>
					</Link>
				</Button>
				<Button
					asChild
					size="lg"
					variant="outline"
					className="h-12 sm:h-14 rounded-full px-8 sm:px-10 text-base sm:text-lg backdrop-blur-sm transition-transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
				>
					<a href="#features">
						{ t("hero.cta_features") }
					</a>
				</Button>
			</div>

			<div className="mt-12 sm:mt-16 flex flex-col items-center gap-3 sm:gap-4">
				<p className="mb-4 sm:mb-8 text-base sm:text-xl font-bold">
					{ t("hero.zatca_compliance") }{ " " }
					<span className="font-bold text-green-600 dark:text-green-400">
						{ t("hero.zatca_phases") }
					</span>
				</p>

				<img
					src={ Zatca_lg_light }
					alt="ZATCA Logo"
					className="block h-24 sm:h-36 md:h-40 object-contain opacity-80 dark:hidden"
				/>
				<img
					src={ Zatca_lg_dark }
					alt="ZATCA Logo"
					className="hidden h-24 sm:h-36 md:h-40 object-contain opacity-80 dark:block"
				/>
			</div>
		</section>
	);
}