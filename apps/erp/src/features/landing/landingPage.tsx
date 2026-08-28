import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { Lightbox, Separator, useLightBox, YusrBackground } from "yusr-ui";
import { Services } from "@/core/services/services.ts";
import LandingFeatures from "./landingFeatures";
import LandingFooter from "./landingFooter";
import LandingHeader from "./landingHeader";
import LandingHero from "./landingHero";
import LandingPricing from "./landingPricing";
import LandingWhyUs from "./landingWhyUs";
import { APP_NAME } from "../../../appConfig.ts";


const Landing = () =>
{
	useSignals();
	const {lightbox, closeLightbox} = useLightBox();
	const {t} = useTranslation("landing");

	useEffect(() =>
	{
		document.title = `${ t("hero.title") } - ${ t("hero.subtitle") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	if (Services.auth.isAuthenticated)
	{
		return <Navigate to="/dashboard" replace/>;
	}

	return (
		<div dir="rtl" className="relative min-h-svh text-foreground">
			<YusrBackground/>
			{ lightbox && (
				<Lightbox
					srcLight={ lightbox.srcLight }
					srcDark={ lightbox.srcDark }
					alt={ lightbox.alt }
					onClose={ closeLightbox }
				/>
			) }
			<LandingHeader/>
			<LandingHero/>
			<Separator className="mx-auto max-w-6xl"/>
			<LandingFeatures/>
			<Separator className="mx-auto max-w-6xl"/>
			<LandingWhyUs/>
			<Separator className="mx-auto max-w-6xl"/>
			<LandingPricing monthlyPrice={ 150 } yearlyPrice={ 125 }/>
			<LandingFooter/>
		</div>
	);
};

export default Landing;