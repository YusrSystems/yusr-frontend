import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BaseEntity } from "../../../entities";
import type { BaseApiService } from "../../../networking";
import { type RequestResult, ResultStatus } from "../../../types";
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
  transformData?: (data: T | Partial<T>) => T | Partial<T>;
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
    transformData,
    onExecute
  }: SaveButtonProps<T>
)
{
  const { t, i18n } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [pendingIgnore, setPendingIgnore] = useState(false);

  async function Save(ignoreWarnings = false)
  {
    console.log(
      "=================================",
      JSON.stringify(formData, null, 2),
      "================================="
    );
    if (!validate())
    {
      return;
    }

    setLoading(true);

    let result: RequestResult<T>;
    const payload = transformData ? transformData(formData) : formData;

    if (onExecute)
    {
      result = await onExecute(payload, ignoreWarnings);
    }
    else if (service)
    {
      const finalPayload = ignoreWarnings ? { ...payload, ignoreWarnings: true } : payload;
      result = dialogMode === "create"
        ? await service.Add(finalPayload as T)
        : await service.Update(finalPayload as T);
    }
    else
    {
      onSuccess?.(formData as T);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (result.status === ResultStatus.UnprocessableEntity)
    {
      setErrors(result.errors);
      setShowErrors(true);
      return;
    }

    if (result.status === ResultStatus.PreconditionFailed)
    {
      setWarnings(result.warnings);
      setShowWarnings(true);
      return;
    }

    if (result.status === ResultStatus.Ok)
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

  const defaultLabel = service ? t("saveButton.saveChanges") : t("saveButton.save");
  const buttonLabel = label ?? defaultLabel;

  return (
    <>
      <Button
        disabled={ loading || pendingIgnore || disable?.() }
        onClick={ () => Save() }
        variant={ variant }
        className={ className }
      >
        { (loading || pendingIgnore) && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
        { buttonLabel }
      </Button>

      <Dialog open={ showWarnings } onOpenChange={ setShowWarnings }>
        <DialogContent dir={ i18n.dir() }>
          <DialogHeader>
            <DialogTitle>{ t("saveButton.warnings") }</DialogTitle>
            <DialogDescription asChild>
              <ul className="mt-2 space-y-1 text-sm text-start">
                { warnings.map((w, i) => <li key={ i } className="text-orange-600">• { w }</li>) }
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{ t("saveButton.cancel") }</Button>
            </DialogClose>
            <Button onClick={ handleIgnoreWarnings }>
              { t("saveButton.ignoreWarnings") }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ showErrors } onOpenChange={ setShowErrors }>
        <DialogContent dir={ i18n.dir() }>
          <DialogHeader>
            <DialogTitle>{ t("saveButton.errors") }</DialogTitle>
            <DialogDescription asChild>
              <ul className="mt-2 space-y-1 text-sm text-start">
                { errors.map((w, i) => <li key={ i } className="text-red-600">• { w }</li>) }
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{ t("saveButton.cancel") }</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
