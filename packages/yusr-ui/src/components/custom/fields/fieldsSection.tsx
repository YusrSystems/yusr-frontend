import { cn } from "../../../utils/cn";
import { TitleSeparator } from "../separators/titleSeparator";

type ColumnsConfig =
  | number
  | {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };

interface FieldsSectionProps {
  title?: string;
  children: React.ReactNode;
  columns?: ColumnsConfig;
  className?: string;
  gridClassName?: string;
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
};

const responsiveColsMap: Record<string, Record<number, string>> = {
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6", 7: "sm:grid-cols-7", 8: "sm:grid-cols-8", 9: "sm:grid-cols-9", 10: "sm:grid-cols-10" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6", 7: "md:grid-cols-7", 8: "md:grid-cols-8", 9: "md:grid-cols-9", 10: "md:grid-cols-10" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6", 7: "lg:grid-cols-7", 8: "lg:grid-cols-8", 9: "lg:grid-cols-9", 10: "lg:grid-cols-10" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6", 7: "xl:grid-cols-7", 8: "xl:grid-cols-8", 9: "xl:grid-cols-9", 10: "xl:grid-cols-10" },
};

function getGridClasses(columns?: ColumnsConfig) {
  if (!columns || typeof columns === "number") return "";
  return cn(
    columns.base && colsMap[columns.base],
    columns.sm && responsiveColsMap.sm[columns.sm],
    columns.md && responsiveColsMap.md[columns.md],
    columns.lg && responsiveColsMap.lg[columns.lg],
    columns.xl && responsiveColsMap.xl[columns.xl],
  );
}

function getGridStyle(columns?: ColumnsConfig): React.CSSProperties | undefined {
  if (typeof columns === "number") {
    return {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    };
  }
  return undefined;
}

export function FieldsSection({
  title,
  children,
  columns = { base: 1, md: 2, lg: 3 },
  className,
  gridClassName,
}: FieldsSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && <TitleSeparator title={title} />}
      <div
        className={cn(
          "grid gap-4",
          typeof columns !== "number" && getGridClasses(columns),
          gridClassName
        )}
        style={getGridStyle(columns)}
      >
        {children}
      </div>
    </div>
  );
}