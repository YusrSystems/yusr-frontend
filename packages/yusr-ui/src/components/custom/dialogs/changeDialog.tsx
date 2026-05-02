import type { PropsWithChildren, ReactNode } from "react";
import type { BaseEntity } from "yusr-core";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";
import { SaveButton, type SaveButtonProps } from "../buttons/saveButton";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";

export interface ChangeDialogProps<T extends BaseEntity> extends SaveButtonProps<T>, PropsWithChildren
{
  title: string;
  description?: string;
  className?: string;
  actionButtons?: ReactNode;
  authorized?: boolean;
}

export function ChangeDialog<T extends BaseEntity>(
  {
    title,
    description = "",
    className = "sm:max-w-sm",
    actionButtons,
    authorized = true,
    formData,
    dialogMode,
    service,
    disable,
    onSuccess,
    validate = () => true,
    onBeforeSave,
    children
  }: ChangeDialogProps<T>
)
{
  if (!authorized)
  {
    return (
      <DialogContent className="sm:max-w-xl rtl" dir="rtl">
        <DialogHeader>
          <DialogTitle>غير مصرح</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <UnauthorizedPage showButtons={ false } />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إغلاق</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent dir="rtl" className={ cn(className, "scroll-auto") }>
      <DialogHeader>
        <DialogTitle>{ title }</DialogTitle>
        <DialogDescription>{ description }</DialogDescription>
      </DialogHeader>

      <Separator />

      { children }

      <DialogFooter>
        { actionButtons }
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={ formData as T }
          dialogMode={ dialogMode }
          service={ service }
          disable={ disable }
          onSuccess={ onSuccess }
          validate={ validate }
          onBeforeSave={ onBeforeSave }
        />
      </DialogFooter>
    </DialogContent>
  );
}
