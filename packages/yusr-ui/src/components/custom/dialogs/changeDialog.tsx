import type { BaseEntity } from "yusr-core";
import type { PropsWithChildren } from "react";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";
import { SaveButton, type SaveButtonProps } from "../buttons/saveButton";

export interface ChangeDialogProps<T extends BaseEntity> extends SaveButtonProps<T>, PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
}

export function ChangeDialog<T extends BaseEntity>(
  {
    title,
    description = "",
    className = "sm:max-w-sm",
    formData,
    dialogMode,
    service,
    disable,
    onSuccess,
    validate = () => true,
    children
  }: ChangeDialogProps<T>
) {
  return (
    <DialogContent dir="rtl" className={cn(className, "scroll-auto")}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <Separator />

      {children}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={formData as T}
          dialogMode={dialogMode}
          service={service}
          disable={disable}
          onSuccess={onSuccess}
          validate={validate}
        />
      </DialogFooter>
    </DialogContent>
  );
}
