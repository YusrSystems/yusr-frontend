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
		<section className="relative mx-auto max-w-6xl px-6 pb-24 pt-15 text-center">
			<Badge
				variant="secondary"
				className="
				mb-10
				rounded-full
				border-primary/20
				bg-primary/5
				text-sm text-primary
				backdrop-blur-md
				transition-colors
				hover:bg-primary/10
				ltr:flex-row-reverse
				min-h-fit"
			>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"/>
            </span>
				<span className="text-wrap">

                { t("hero.badge") }
            </span>
			</Badge>

			{ /* Title */ }
			<h1 className="text-4xl! font-extrabold leading-[1.1] tracking-tighter md:text-6xl!">
        <span className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          { t("hero.title") }
        </span>
			</h1>

			{ /* Subtitle */ }
			<h2 className="mt-6 text-3xl font-bold tracking-tight text-primary md:text-5xl">
				{ t("hero.subtitle") }
			</h2>

			{ /* Description */ }
			<p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
				{ t("hero.description") }
			</p>

			{ /* CTA Buttons */ }
			<div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row ltr:flex-row-reverse">
				<Button
					asChild
					size="lg"
					className="flex ltr:flex-row-reverse h-14 rounded-full px-10 text-lg shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
				>
					<Link to="/register">
						{ t("hero.cta_start") }
						<ArrowLeft className="ms-2 h-5 w-5 transition-transform ltr:rotate-180"/>
					</Link>
				</Button>
				<Button
					asChild
					size="lg"
					variant="outline"
					className="h-14 rounded-full px-10 text-lg backdrop-blur-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
				>
					<a href="#features">
						{ t("hero.cta_features") }
					</a>
				</Button>
			</div>

			{ /* ZATCA Badge */ }
			<div className="mt-16 flex flex-col items-center gap-4">
				<p className="mb-8 text-xl font-bold">
					{ t("hero.zatca_compliance") }{ " " }
					<span className="font-bold text-green-600 dark:text-green-400">
            { t("hero.zatca_phases") }
          </span>
				</p>
				{ /* Swap with actual ZATCA logo images */ }
				<img
					src={ Zatca_lg_light }
					alt="ZATCA Logo"
					className="block h-40 object-contain opacity-80 dark:hidden"
				/>
				<img
					src={ Zatca_lg_dark }
					alt="ZATCA Logo"
					className="hidden h-40 object-contain opacity-80 dark:block"
				/>
			</div>
		</section>
	);
}
