import type { PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { ChangeableEntity, Dto } from "../../../stateManager";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";
import { SaveButton, type SaveButtonProps } from "../buttons/saveButton";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";

export interface ChangeDialogProps<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>
  extends SaveButtonProps<TEntity, TDto>, PropsWithChildren
{
  title: string;
  description?: string;
  className?: string;
  actionButtons?: ReactNode;
  authorized?: boolean;
}

export function ChangeDialog<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
  {
    title,
    description = "",
    className = "sm:max-w-sm",
    actionButtons,
    authorized = true,
    children,
    ...props
  }: ChangeDialogProps<TEntity, TDto>
)
{
  const { t, i18n } = useTranslation("common");

  if (!authorized)
  {
    return (
      <DialogContent className="sm:max-w-xl" dir={ i18n.dir() }>
        <DialogHeader>
          <DialogTitle>{ t("changeDialog.unauthorized") }</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <UnauthorizedPage showButtons={ false } />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{ t("changeDialog.close") }</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent dir={ i18n.dir() } className={ cn(className, "scroll-auto") }>
      <DialogHeader>
        <DialogTitle>{ title }</DialogTitle>
        <DialogDescription>{ description }</DialogDescription>
      </DialogHeader>

      <Separator />

      { children }

      <DialogFooter>
        { actionButtons }
        <DialogClose asChild>
          <Button variant="outline">{ t("changeDialog.cancel") }</Button>
        </DialogClose>
        <SaveButton { ...props } />
      </DialogFooter>
    </DialogContent>
  );
}
