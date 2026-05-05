import { ArrowLeft, Check, Infinity } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge, Button, cn } from "yusr-ui";

type PricingFeature = {
  index: number;
  label: string;
  type: "title" | "check" | "unlimited";
};

export default function LandingPricing(
  {
    monthlyPrice,
    yearlyPrice
  }: {
    monthlyPrice: number;
    yearlyPrice: number;
  }
)
{
  const { t, i18n } = useTranslation("landing");
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const price = billing === "yearly" ? yearlyPrice : monthlyPrice;
  const annual = price * 12;
  const saving = (monthlyPrice - yearlyPrice) * 12;

  const features = t("pricing.features", { returnObjects: true }) as PricingFeature[];

  return (
    <section id="pricing" dir={ i18n.dir() } className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">{ t("pricing.title") }</h2>
        <p className="mt-5 text-lg font-bold text-muted-foreground">
          { t("pricing.subtitle") }
        </p>
      </div>

      { /* Billing toggle */ }
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1">
          <button
            onClick={ () => setBilling("monthly") }
            className={ cn(
              "rounded-full px-6 py-2 text-sm font-semibold transition-all",
              billing === "monthly"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            ) }
          >
            { t("pricing.billing.monthly") }
          </button>
          <button
            onClick={ () => setBilling("yearly") }
            className={ cn(
              "rounded-full px-6 py-2 text-sm font-semibold transition-all flex items-center gap-2",
              billing === "yearly"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            ) }
          >
            { t("pricing.billing.yearly") }
            <Badge
              variant="secondary"
              className={ cn(
                "text-[10px] px-1.5 py-0",
                billing === "yearly"
                  ? "bg-green-500/20 text-green-600 border-green-500/20"
                  : "bg-green-500/10 text-green-600 border-green-500/10"
              ) }
            >
              { t("pricing.billing.save", { amount: saving }) }
            </Badge>
          </button>
        </div>
      </div>

      { /* Pricing card + feature table */ }
      <div className="overflow-hidden rounded-2xl bg-card border border-primary/20 shadow-xl shadow-primary/5">
        { /* Header row */ }
        <div className="grid grid-cols-[1fr_auto]">
          { /* Left: Plan name */ }
          <div className="border-b border-border bg-muted/20 px-6 py-5">
            <p className="text-lg font-medium text-muted-foreground mb-1">{ t("pricing.plan.name") }</p>
            <p className="text-base text-muted-foreground">{ t("pricing.plan.description") }</p>
          </div>

          { /* Right: Price */ }
          <div className="border-b border-border bg-primary px-8 py-5 text-center text-primary-foreground w-48">
            <div className="flex items-baseline justify-center gap-1">
              { billing === "yearly" && <span className="text-sm line-through opacity-60">{ monthlyPrice }</span> }
              <span className="text-4xl font-extrabold">{ price }</span>
            </div>
            <span className="text-sm opacity-80">{ t("pricing.plan.currency") }{ t("pricing.plan.perMonth") }</span>
            <p className="mt-1 text-xs opacity-70">
              { billing === "yearly"
                ? t("pricing.plan.paidAnnually", { amount: annual })
                : t("pricing.plan.annualTotal", { amount: annual }) }
            </p>
          </div>
        </div>

        { /* Feature rows */ }
        { features.map((f) => (
          <div key={ f.index } className="grid grid-cols-[1fr_auto]">
            <div
              className={ cn(
                "border-b border-border/50 px-6 py-3",
                f.type === "title"
                  ? "bg-muted/30 text-sm font-bold pt-5"
                  : "text-sm text-muted-foreground"
              ) }
            >
              { f.label }
            </div>
            <div
              className={ cn(
                "border-b border-border/50 bg-primary/8 dark:bg-primary/12 px-8 py-3 min-w-48 flex items-center justify-center",
                f.type === "title" ? "pt-5" : ""
              ) }
            >
              { f.type === "check" && <Check className="h-4 w-4 text-green-500" strokeWidth={ 2.5 } /> }
              { f.type === "unlimited" && (
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Infinity className="h-3.5 w-3.5" />
                  { t("pricing.unlimited") }
                </span>
              ) }
            </div>
          </div>
        )) }

        { /* Footer CTA row */ }
        <div className="grid grid-cols-[1fr_auto]">
          <div className="px-6 py-5 bg-muted/10" />
          <div className="bg-primary/8 dark:bg-primary/12 min-w-48 px-6 py-5 flex items-center justify-center">
            <Link to="/register">
              <Button size="sm" className="gap-2 w-full">
                { t("pricing.cta") }
                <ArrowLeft className="h-3.5 w-3.5 ltr:rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
