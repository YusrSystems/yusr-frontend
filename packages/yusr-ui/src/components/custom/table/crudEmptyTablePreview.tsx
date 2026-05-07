"use client";

import { LoaderPinwheelIcon, RefreshCwOff, Table } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../status/empty";

type EmptyTableMode = "empty" | "loading" | "error";

type EmptyTablePreviewProps = { mode: EmptyTableMode; };

export function CrudEmptyTablePreview({ mode }: EmptyTablePreviewProps)
{
  if (mode === "loading")
  {
    return <LoadingMode />;
  }
  else if (mode === "error")
  {
    return <ErrorMode />;
  }
  return <EmptyMode />;
}

function LoadingMode()
{
  const { t } = useTranslation("common");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>{ t("crudEmptyTable.loadingTitle") }</EmptyTitle>
        <EmptyDescription>{ t("crudEmptyTable.loadingDescription") }</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <LoaderPinwheelIcon className="animate-spin duration-700" />
      </EmptyContent>
    </Empty>
  );
}

function EmptyMode()
{
  const { t } = useTranslation("common");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>{ t("crudEmptyTable.emptyTitle") }</EmptyTitle>
        <EmptyDescription>{ t("crudEmptyTable.emptyDescription") }</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ErrorMode()
{
  const { t } = useTranslation("common");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>{ t("crudEmptyTable.errorTitle") }</EmptyTitle>
        <EmptyDescription>{ t("crudEmptyTable.errorDescription") }</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <RefreshCwOff />
      </EmptyContent>
    </Empty>
  );
}
