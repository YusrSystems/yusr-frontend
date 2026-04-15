import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import { StorageFileStatus } from "@/app/core/data/storageFile";
import DepositReportApiService from "@/app/core/networking/reports/depositReportApiService";
import { Button, isPDF, ScrollArea } from "yusr-ui";
import { Archive, ArrowLeft, Banknote, Box, Edit, FileIcon, Loader2, PackagePlus, Printer, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Deposit } from "../data/deposit";
import { useAppSelector } from "@/app/core/state/store";
import { SystemPermissions } from "yusr-core";

type TripDepositsParams = {
  deposits: Deposit[];
  onDepositDeleted: (index: number) => void;
  onDepositDialogOpened: (deposit: Deposit | undefined) => void;
};

export default function TripDeposits({ deposits, onDepositDeleted, onDepositDialogOpened }: TripDepositsParams) {
  const authState = useAppSelector((state) => state.auth);
  const [printingId, setPrintingId] = useState<number | null>(null);
  const [sharingId, setSharingId] = useState<number | null>(null); // Added state

  const handlePrintDeposit = async (depositId?: number) => {
    if (depositId == undefined) {
      toast.error("لم يتم حفظ التغييرات بعد");
      return;
    }

    setPrintingId(depositId);
    try {
      const currentUserId = authState.loggedInUser?.id;
      await DepositReportApiService.getReport(depositId, currentUserId ?? 0);
    }
    finally {
      setPrintingId(null);
    }
  };

  const handleShareDeposit = async (depositId?: number) => {
    if (depositId == undefined) {
      toast.error("لم يتم حفظ التغييرات بعد");
      return;
    }

    setSharingId(depositId);
    try {
      const currentUserId = authState.loggedInUser?.id;
      await DepositReportApiService.getReport(depositId, currentUserId ?? 0, "share", `deposit_${depositId}`);
    }
    finally {
      setSharingId(null);
    }
  };

  return (
    <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full border-border/50">
      { /* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b">
        <div className="flex items-center gap-2 text-primary">
          <Archive className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold text-foreground">الأمانات ({deposits.length})</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDepositDialogOpened(undefined)}
          className="h-6 px-2 text-[10px] gap-1 hover:bg-primary hover:text-primary-foreground border-dashed"
        >
          <PackagePlus className="w-3 h-3" />
          إضافة
        </Button>
      </div>

      { /* Content Area */}
      <ScrollArea className="h-75">
        <div className="divide-y divide-border/30">
          {!deposits.length
            ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <Box className="w-6 h-6 mb-1 stroke-1" />
                <p className="text-[10px]">لا توجد بيانات</p>
              </div>
            )
            : (deposits.map((dep, i) => {
              const amount = dep.amount || 0;
              const paid = dep.paidAmount || 0;
              const remaining = amount - paid;
              const isFullyPaid = remaining <= 0;
              const isPrinting = printingId === dep.id;
              const img = dep.image?.status !== StorageFileStatus.Delete ? dep.image?.url : undefined;
              const isPdf = isPDF(dep.image);

              return (
                <div
                  dir="rtl"
                  key={i}
                  className="group relative flex items-center gap-2 p-2 hover:bg-muted/30 transition-colors"
                >
                  { /* Column 1: Info (Flexible) */}
                  <div className="flex flex-1 items-center gap-2 min-w-0">
                    <div className="shrink-0">
                      {img
                        ? (isPdf
                          ? (
                            <div className="w-9 h-9 rounded-md bg-red-50 flex flex-col items-center justify-center border border-red-200 shadow-sm transition-colors group-hover:bg-red-100">
                              <FileIcon className="w-4 h-4 text-red-600" />
                              <span className="text-[7px] font-bold text-red-700 mt-0.5">PDF</span>
                            </div>
                          )
                          : (
                            <img
                              alt=""
                              src={img}
                              className="w-9 h-9 rounded-md object-cover border bg-white shadow-sm"
                            />
                          ))
                        : (
                          <div className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center border border-dashed">
                            <Box className="w-4 h-4 text-muted-foreground/30" />
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-sm max-w-50 font-bold truncate text-foreground/90 leading-tight">
                        {dep.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                        <span className="truncate max-w-15">{dep.sender}</span>
                        <ArrowLeft className="h-2 w-2 shrink-0" />
                        <span className="truncate max-w-15">{dep.recipient}</span>
                      </div>
                    </div>
                  </div>

                  { /* Column 2: Financials (Compact & Smart) */}
                  <div className="flex flex-col items-end gap-0.5 px-3 border-r border-dashed shrink-0 min-w-21.25">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                      <span>{amount.toLocaleString()}</span>
                      <Banknote className="w-3 h-3 text-muted-foreground opacity-70" />
                    </div>

                    {isFullyPaid
                      ? (
                        <div className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                          <span>مدفوعة</span>
                        </div>
                      )
                      : (
                        <div className="text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          باقي: {remaining.toLocaleString()}
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-1 ml-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPrinting || sharingId === dep.id}
                      onClick={() => onDepositDialogOpened(dep)}
                      className="w-7 h-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPrinting || sharingId === dep.id}
                      onClick={() => onDepositDeleted(i)}
                      className="w-7 h-7 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    {SystemPermissions.hasAuth(
                      authState.loggedInUser?.role?.permissions ?? [],
                      SystemPermissionsResources.DepositReport,
                      SystemPermissionsActions.Get
                    )
                      ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPrinting || sharingId === dep.id}
                            onClick={() => handlePrintDeposit(dep.id)}
                            className="w-7 h-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {isPrinting
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                              : <Printer className="w-3.5 h-3.5" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPrinting || sharingId === dep.id}
                            onClick={() => handleShareDeposit(dep.id)}
                            className="w-7 h-7 rounded-md hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                          >
                            {sharingId === dep.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                              : <Share2 className="w-3.5 h-3.5" />}
                          </Button>
                        </>
                      )
                      : <div className="col-span-2" />}
                  </div>
                </div>
              );
            }))}
        </div>
      </ScrollArea>
    </div>
  );
}
