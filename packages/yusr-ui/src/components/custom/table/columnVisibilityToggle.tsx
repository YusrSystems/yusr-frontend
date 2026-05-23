import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "yusr-ui";

export type ColumnDef = {
  key: string;
  label: string;
};

type Props = {
  columns: ColumnDef[];
  visible: Record<string, boolean>;
  toggle: (key: string) => void;
};

export function ColumnVisibilityToggle({ columns, visible, toggle }: Props)
{
  const { t } = useTranslation("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="w-4 h-4 me-2" />
          { t("table.columns") }
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        { columns.map(({ key, label }) => (
          <DropdownMenuCheckboxItem
            key={ key }
            checked={ visible[key] ?? true }
            onCheckedChange={ () => toggle(key) }
          >
            { label }
          </DropdownMenuCheckboxItem>
        )) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
