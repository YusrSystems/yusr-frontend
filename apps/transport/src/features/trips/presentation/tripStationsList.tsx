import { format } from "date-fns";

interface Station
{
  index: number;
  cityName: string;
  period?: number; // hours from start
}

interface TripStationsListProps
{
  stations?: Station[];
  startDate?: Date;
}

export default function TripStationsList({ stations, startDate }: TripStationsListProps)
{
  if (!stations || stations.length === 0)
  {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <h3 className="text-sm font-bold border-b pb-1">جدول محطات الرحلة</h3>
      { stations.slice().sort((a, b) => a.index - b.index).map((station, idx) =>
      {
        const baseDate = startDate ? new Date(startDate) : new Date();
        const periodInMs = (station.period || 0) * 60 * 60 * 1000;
        const arrivalDate = new Date(baseDate.getTime() + periodInMs);

        const dateDisplay = format(arrivalDate, "yyyy-MM-dd");
        const timeDisplay = arrivalDate.toLocaleTimeString("ar-SA-u-nu-latn", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });

        return (
          <div
            key={ idx }
            className="flex justify-between items-center p-2 bg-muted/30 rounded-lg border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                { idx + 1 }
              </div>
              <span className="text-xs font-medium">{ station.cityName }</span>
            </div>

            <div className="text-left">
              <span className="text-[10px] text-muted-foreground block">الوصول المتوقع</span>
              <span className="text-[9px] font-bold text-emerald-600 tabular-nums">
                { dateDisplay } <span className="mx-1 text-muted-foreground">|</span> { timeDisplay }
              </span>
            </div>
          </div>
        );
      }) }
    </div>
  );
}
