import { Card, CardContent, CardHeader, CardTitle } from "../../pure/card";
import type { ReactNode } from "react";

export type CardProps = { title: string; data: string; icon: ReactNode; };

export function CrudTableCard({ cards }: { cards: CardProps[]; })
{
  return (
    <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      { cards.map((card, i) => (
        <Card key={ i } className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{ card.title }</CardTitle>
            { card.icon }
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ card.data }</div>
          </CardContent>
        </Card>
      )) }
    </div>
  );
}
