import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { BaseApiService } from "../../../networking";
import type { ChangeableEntity, Dto } from "../../../stateManager";
import { type RequestResult, ResultStatus } from "../../../types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure";
import { Button } from "../../pure/button";

export interface SaveButtonProps<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>
{
  entity: TEntity;
  service: BaseApiService<TEntity, TDto>;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  className?: string;
  disabled?: boolean;
  onSuccess?: (newData: TEntity) => void;
  transformData?: (data: TEntity) => TEntity | Promise<TEntity>;
}

export function SaveButton<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
  {
    entity,
    service,
    label,
    variant = "default",
    className,
    disabled,
    onSuccess,
    transformData
  }: SaveButtonProps<TEntity, TDto>
)
{
  useSignals();
  const { t, i18n } = useTranslation("common");
  const loading = useMemo(() => signal(false), []);
  const errors = useMemo(() => signal<string[]>([]), []);
  const showErrors = useMemo(() => signal(false), []);
  const warnings = useMemo(() => signal<string[]>([]), []);
  const showWarnings = useMemo(() => signal(false), []);
  const pendingIgnore = useMemo(() => signal(false), []);

  async function Save()
  {
    if (!entity.validate())
    {
      return;
    }

    loading.value = true;

    let result: RequestResult<TEntity>;
    const payload = transformData ? await transformData(entity) : entity;

    result = payload.mode.value === "create"
      ? await service.Add(payload)
      : await service.Update(payload);

    if (result?.data)
    {
      result.data.mode.value = payload.mode.value;
    }

    loading.value = false;

    if (result.status === ResultStatus.UnprocessableEntity)
    {
      errors.value = result.errors;
      showErrors.value = true;
      return;
    }

    if (result.status === ResultStatus.PreconditionFailed)
    {
      warnings.value = result.warnings;
      showWarnings.value = true;
      return;
    }

    if (result.status === ResultStatus.Ok && result.data != undefined)
    {
      onSuccess?.(result.data);
    }
  }

  async function handleIgnoreWarnings()
  {
    showWarnings.value = false;
    pendingIgnore.value = true;
    entity.ignoreWarnings.value = true;
    await Save();
    pendingIgnore.value = false;
  }

  const defaultLabel = service ? t("saveButton.saveChanges") : t("saveButton.save");
  const buttonLabel = label ?? defaultLabel;

  return (
    <>
      <Button
        disabled={ loading.value || pendingIgnore.value || disabled }
        onClick={ () => Save() }
        variant={ variant }
        className={ className }
      >
        { (loading.value || pendingIgnore.value) && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
        { buttonLabel }
      </Button>

      <Dialog open={ showWarnings.value } onOpenChange={ (open) => showWarnings.value = open }>
        <DialogContent dir={ i18n.dir() }>
          <DialogHeader>
            <DialogTitle>{ t("saveButton.warnings") }</DialogTitle>
            <DialogDescription asChild>
              <ul className="mt-2 space-y-1 text-sm text-start">
                { warnings.value.map((w, i) => <li key={ i } className="text-orange-600">• { w }</li>) }
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

      <Dialog open={ showErrors.value } onOpenChange={ (open) => showErrors.value = open }>
        <DialogContent dir={ i18n.dir() }>
          <DialogHeader>
            <DialogTitle>{ t("saveButton.errors") }</DialogTitle>
            <DialogDescription asChild>
              <ul className="mt-2 space-y-1 text-sm text-start">
                { errors.value.map((w, i) => <li key={ i } className="text-red-600">• { w }</li>) }
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
