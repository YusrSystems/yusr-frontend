import { Lightbox, Separator, useLightBox, YusrBusBackground } from "yusr-ui";
import LandingFeatures from "./landingFeatures";
import LandingFooter from "./landingFooter";
import LandingHeader from "./landingHeader";
import LandingHero from "./landingHero";
import LandingPricing from "./landingPricing";
import LandingWhyUs from "./landingWhyUs";

const Landing = () =>
{
  const { lightbox, closeLightbox } = useLightBox();

  return (
    <div dir="rtl" className="relative min-h-svh text-foreground">
      <YusrBusBackground />

      { lightbox && (
        <Lightbox
          srcLight={ lightbox.srcLight }
          srcDark={ lightbox.srcDark }
          alt={ lightbox.alt }
          onClose={ closeLightbox }
        />
      ) }

      <LandingHeader />
      <LandingHero />

      <Separator className="mx-auto max-w-6xl" />
      <LandingFeatures />

      <Separator className="mx-auto max-w-6xl" />
      { /* <LandingSystemPreview openLightbox={ openLightbox } features={ features } /> */ }

      <Separator className="mx-auto max-w-6xl" />
      <LandingWhyUs />

      <Separator className="mx-auto max-w-6xl" />
      <LandingPricing monthlyPrice={ 150 } yearlyPrice={ 125 } />

      <LandingFooter />
    </div>
  );
};

export default Landing;
