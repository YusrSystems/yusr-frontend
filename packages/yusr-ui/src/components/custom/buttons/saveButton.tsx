import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { BaseApiService, BaseEntity, RequestResult } from "yusr-core";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure";
import { Button } from "../../pure/button";
import type { DialogMode } from "../dialogs/dialogType";

export interface SaveButtonProps<T extends BaseEntity>
{
  formData: T | Partial<T>;
  dialogMode?: DialogMode;
  service?: BaseApiService<T>;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  className?: string;
  disable?: () => boolean;
  onSuccess?: (newData: T) => void;
  validate?: () => boolean;
  onBeforeSave?: () => Promise<{ handled: boolean; data?: T; }>;
  onExecute?: (
    formData: T | Partial<T>,
    ignoreWarnings: boolean
  ) => Promise<RequestResult<T>>;
}

export function SaveButton<T extends BaseEntity>(
  {
    formData,
    dialogMode,
    service,
    label,
    variant = "default",
    className,
    disable,
    onSuccess,
    validate = () => true,
    onBeforeSave,
    onExecute
  }: SaveButtonProps<T>
)
{
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [pendingIgnore, setPendingIgnore] = useState(false);

  async function Save(ignoreWarnings = false)
  {
    if (!validate())
    {
      return;
    }

    if (onBeforeSave)
    {
      setLoading(true);
      const { handled, data } = await onBeforeSave();
      setLoading(false);
      if (handled)
      {
        if (data)
        {
          onSuccess?.(data);
        }
        return;
      }
    }

    setLoading(true);

    let result: RequestResult<T>;

    if (onExecute)
    {
      result = await onExecute(formData, ignoreWarnings);
    }
    else if (service)
    {
      const payload = ignoreWarnings ? { ...formData, ignoreWarnings: true } : formData;
      result = dialogMode === "create"
        ? await service.Add(payload as T)
        : await service.Update(payload as T);
    }
    else
    {
      onSuccess?.(formData as T);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (result.status === 412)
    {
      const lines = result.errorDetails
        ?.split("/n")
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0) ?? [];
      setWarnings(lines);
      setShowWarnings(true);
      return;
    }

    if (result.status === 200)
    {
      onSuccess?.(result.data as T);
    }
  }

  async function handleIgnoreWarnings()
  {
    setShowWarnings(false);
    setPendingIgnore(true);
    await Save(true);
    setPendingIgnore(false);
  }

  return (
    <>
      <Button
        disabled={ loading || pendingIgnore || disable?.() }
        onClick={ () => Save() }
        variant={ variant }
        className={ className }
      >
        { (loading || pendingIgnore) && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
        { label ?? `حفظ ${service ? "التغييرات" : ""}` }
      </Button>

      <Dialog open={ showWarnings } onOpenChange={ setShowWarnings }>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تحذيرات</DialogTitle>
            <DialogDescription asChild>
              <ul className="mt-2 space-y-1 text-sm text-right">
                { warnings.map((w, i) => <li key={ i } className="text-orange-600">• { w }</li>) }
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={ handleIgnoreWarnings }>
              تجاهل التحذيرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
