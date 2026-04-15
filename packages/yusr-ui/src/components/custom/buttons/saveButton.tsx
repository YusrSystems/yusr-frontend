import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { BaseEntity } from "@yusr_systems/core";
import type { BaseApiService } from "@yusr_systems/core";
import { Button } from "../../pure/button";
import type { DialogMode } from "../dialogs/dialogType";

export interface SaveButtonProps<T extends BaseEntity>
{
  formData: T | Partial<T>;
  dialogMode?: DialogMode;
  service?: BaseApiService<T>;
  disable?: () => boolean;
  onSuccess?: (newData: T) => void;
  validate?: () => boolean;
}

export function SaveButton<T extends BaseEntity>(
  { formData, dialogMode, service, disable, onSuccess, validate = () => true }: SaveButtonProps<T>
)
{
  const [loading, setLoading] = useState(false);

  async function Save()
  {
    if (!validate())
    {
      return;
    }

    if (!service)
    {
      onSuccess?.(formData as T);
      return;
    }

    setLoading(true);

    const result = dialogMode === "create" ? await service.Add(formData as T) : await service.Update(formData as T);

    setLoading(false);

    if (result.status === 200)
    {
      onSuccess?.(result.data as T);
    }
  }

  return (
    <Button disabled={ loading || disable?.() } onClick={ Save }>
      { loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
      حفظ
      { service ? " التغييرات" : "" }
    </Button>
  );
}
