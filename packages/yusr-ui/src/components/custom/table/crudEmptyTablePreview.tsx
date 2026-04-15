"use client";

import { LoaderPinwheelIcon, RefreshCwOff, Table } from "lucide-react";
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>الرجاء الانتظار</EmptyTitle>
        <EmptyDescription>يتم تحميل البيانات المطلوبة</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <LoaderPinwheelIcon className="animate-spin duration-700" />
      </EmptyContent>
    </Empty>
  );
}

function EmptyMode()
{
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>لا توجد بيانات لعرضها</EmptyTitle>
        <EmptyDescription>هذا الجدول فارغ ولا يحتوي على بيانات للعرض</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ErrorMode()
{
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>حدث خطأ ما</EmptyTitle>
        <EmptyDescription>
          حدث خطأ اثناء جلب البيانات الرجاء التحقق من اتصالك الانترنت او اتصل بخدمة العملاء لدينا في حال تكراره
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <RefreshCwOff />
      </EmptyContent>
    </Empty>
  );
}
