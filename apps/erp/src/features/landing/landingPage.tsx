import { Globe, HelpCircle, RefreshCw, Rocket, ShieldCheck, Tags, Timer } from "lucide-react";
import { Lightbox, Separator, useLightBox, YusrBusBackground } from "yusr-ui";
import LandingFeatures from "./landingFeatures";
import LandingFooter from "./landingFooter";
import LandingHeader from "./landingHeader";
import LandingHero from "./landingHero";
import LandingPricing from "./landingPricing";
import LandingWhyUs from "./landingWhyUs";

const whyUs = [{
  icon: HelpCircle,
  title: "دعم فني متوفر مجانًا",
  desc: "متوفر دائمًا مجانًا، لمساعدتك في أي استفسار أو مشكلة بشكل سريع وفعّال."
}, {
  icon: ShieldCheck,
  title: "الأمان والحماية",
  desc: "يولي يُسر اهتمامًا كاملًا بسلامة بياناتك على خوادم مؤمنة بالكامل."
}, {
  icon: Rocket,
  title: "واجهة سهلة الاستخدام",
  desc: "أدِر أعمالك بكل سهولة عبر واجهة عربية واضحة وبسيطة، مع أدوات مدمجة لا تتطلب خبرة عميقة."
}, {
  icon: Timer,
  title: "توفير الوقت والجهد",
  desc: "تابع مؤشرات أعمالك وأدِر عملياتك بسرعة وكفاءة، مع خطوات سهلة توفر عليك الوقت والمجهود."
}, {
  icon: Globe,
  title: "من أي مكان وفي أي وقت",
  desc: "كونه نظامًا سحابيًا، يمكنك الوصول إليه من أي جهاز وفي أي وقت."
}, {
  icon: RefreshCw,
  title: "تحديثات دورية مجانًا",
  desc: "يتم تحديث البرنامج باستمرار لإضافة ميزات وأدوات جديدة، وستحصل عليها مجانًا."
}, {
  icon: Tags,
  title: "سعر اقتصادي",
  desc: "احصل على نظام محاسبي متكامل باشتراك شهري بسيط، مع دعم فني مستمر وتحديثات مجانية."
}];

const pricingFeatures: { index: number; label: string; type: "title" | "check" | "unlimited"; }[] = [
  { index: 1, label: "المعاملات المالية", type: "title" },
  { index: 2, label: "الفواتير", type: "unlimited" },
  { index: 3, label: "عروض الأسعار", type: "unlimited" },
  { index: 4, label: "سندات القبض والصرف", type: "unlimited" },
  { index: 5, label: "الخزائن والحسابات البنكية", type: "unlimited" },
  { index: 6, label: "طرق الدفع", type: "unlimited" },
  { index: 7, label: "التقارير", type: "check" },
  { index: 8, label: "الفاتورة الإلكترونية", type: "title" },
  { index: 9, label: "المرحلة الأولى", type: "check" },
  { index: 10, label: "المرحلة الثانية", type: "check" },
  { index: 11, label: "المخزون", type: "title" },
  { index: 12, label: "المنتجات والخدمات", type: "unlimited" },
  { index: 13, label: "تتبع المخزون", type: "check" },
  { index: 14, label: "جرد المخزون", type: "check" },
  { index: 15, label: "المستودعات", type: "unlimited" },
  { index: 16, label: "تسوية المواد", type: "check" },
  { index: 17, label: "الكشوفات والتقارير", type: "check" },
  { index: 18, label: "المحاسبة", type: "title" },
  { index: 19, label: "الحسابات (عميل، مورد، موظف، إلخ)", type: "unlimited" },
  { index: 20, label: "تتبع الأرصدة", type: "check" },
  { index: 21, label: "الكشوفات والتقارير", type: "check" },
  { index: 22, label: "المستخدمون", type: "title" },
  { index: 23, label: "عدد المستخدمين", type: "unlimited" },
  { index: 24, label: "الأدوار والصلاحيات", type: "unlimited" }
];

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
      <LandingWhyUs whyUs={ whyUs } />

      <Separator className="mx-auto max-w-6xl" />
      <LandingPricing features={ pricingFeatures } monthlyPrice={ 150 } yearlyPrice={ 125 } />

      <LandingFooter />
    </div>
  );
};

export default Landing;
