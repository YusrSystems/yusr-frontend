import { ArrowLeft, CheckCircle2, FileText, Landmark, Package, Receipt, Users, Warehouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "yusr-ui";

export default function LandingFeatures()
{
  const featureIcons = {
    invoices: Receipt,
    accounts: Landmark,
    inventory: Package,
    stores: Warehouse,
    vouchers: FileText,
    users: Users
  } as const;

  const { t, i18n } = useTranslation("landing");

  const items = t("features.items", {
    returnObjects: true
  }) as {
    id: keyof typeof featureIcons;
    title: string;
    desc: string;
    details: string[];
    cta: string;
    to: string;
  }[];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">{ t("features.title") }</h2>
        <p className="mt-5 text-base text-muted-foreground">
          { t("features.description") }
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        { items.map((f, i) =>
        {
          const Icon = featureIcons[f.id];
          return (
            <Card
              dir={ i18n.dir() }
              key={ i }
              className="group flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{ f.title }</CardTitle>
                <CardDescription className="leading-relaxed">{ f.desc }</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="space-y-2">
                  { f.details.map((d) => (
                    <li key={ d } className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                      { d }
                    </li>
                  )) }
                </ul>

                <div className="mt-auto pt-1">
                  <Link to={ f.to }>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex w-full gap-2 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:text-primary"
                    >
                      { f.cta } <ArrowLeft className="ms-2 h-5 w-5 transition-transform ltr:rotate-180" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        }) }
      </div>
    </section>
  );
}
