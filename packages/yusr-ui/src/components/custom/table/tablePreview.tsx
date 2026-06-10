import { LoaderPinwheelIcon, RefreshCwOff, Table } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../status/empty";
export type TablePreviewProps = PropsWithChildren & {
  title: string;
  description?: string;
};

export function TablePreview({ title, description, children }: TablePreviewProps)
{
  return (
    <div className="rounded-b-xl border shadow-sm overflow-auto ">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Table />
          </EmptyMedia>
          <EmptyTitle>{ title }</EmptyTitle>
          <EmptyDescription>{ description }</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          { children }
        </EmptyContent>
      </Empty>
    </div>
  );
}

export function TablePreviewCompact({ description }: Omit<TablePreviewProps, "title" | "children">)
{
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyDescription>{ description }</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

TablePreview.Loading = function()
{
  const { t } = useTranslation("common");
  return (
    <TablePreview title={ t("crudEmptyTable.loadingTitle") } description={ t("crudEmptyTable.loadingDescription") }>
      <LoaderPinwheelIcon className="animate-spin duration-700" />
    </TablePreview>
  );
};

TablePreview.Error = function()
{
  const { t } = useTranslation("common");
  return (
    <TablePreview title={ t("crudEmptyTable.errorTitle") } description={ t("crudEmptyTable.errorDescription") }>
      <RefreshCwOff />
    </TablePreview>
  );
};

TablePreview.Empty = function()
{
  const { t } = useTranslation("common");
  return <TablePreview title={ t("crudEmptyTable.emptyTitle") } description={ t("crudEmptyTable.emptyDescription") } />;
};

TablePreviewCompact.Empty = function()
{
  const { t } = useTranslation("common");
  return <TablePreviewCompact description={ t("crudEmptyTable.emptyDescription") } />;
};
