import { Loader2, OctagonAlert } from "lucide-react";
import { useState } from "react";
import type { BaseEntity } from "@yusr_systems/core";
import type { BaseApiService } from "@yusr_systems/core";
import { Button } from "../../pure/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";

interface Props<T extends BaseEntity>
{
  entityName: string;
  id: number;
  service: BaseApiService<T>;
  onSuccess?: () => void;
}

export function DeleteDialog<T extends BaseEntity>({ entityName, id, service, onSuccess }: Props<T>)
{
  const [loading, setLoading] = useState(false);

  async function Delete()
  {
    setLoading(true);

    const res = await service.Delete(id);

    if (res.status === 200)
    {
      onSuccess?.();
    }

    setLoading(false);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>حذف { entityName }</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator></Separator>

      <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <OctagonAlert className="h-7 w-7 text-destructive" />
      </div>

      <span className="font-bold text-center text-xl">هل أنت متأكد من حذف { entityName } رقم { id }؟</span>

      <span className="text-center text-[15px]">
        لا يمكن التراجع عن هذا الإجراء. سيؤدي ذلك إلى حذف { entityName } نهائياً وإزالته من خوادمنا.
      </span>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <Button variant="destructive" onClick={ Delete } disabled={ loading }>
          { loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
          تأكيد الحذف
        </Button>
      </DialogFooter>
    </>
  );
}
