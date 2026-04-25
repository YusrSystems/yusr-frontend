import ZatcaLogo from "@/assets/Zatca_logo.png";
import type { EInvoicingEnvironmentType } from "@/core/data/setting";
import { Badge } from "lucide-react";
import { useState } from "react";
import { Button, Dialog, DialogContent } from "yusr-ui";
import { EInvoicingRegister } from "./eInvoicingRegister";

interface EInvoicingRegisterButtonProps
{
  title: string;
  subtitle: string;
  linkType: EInvoicingEnvironmentType;
  linked: boolean;
  onFinish?: () => void;
}

export function EInvoicingRegisterButton({
  title,
  subtitle,
  linkType,
  linked,
  onFinish
}: EInvoicingRegisterButtonProps)
{
  const [open, setOpen] = useState(false);

  const handleFinish = () =>
  {
    setOpen(false);
    onFinish?.();
  };

  return (
    <>
      <div className="flex items-center rounded-2xl border bg-card p-4 shadow-sm">
        <img
          src={ ZatcaLogo }
          alt="ZatcaLogo"
          className="w-14 h-14 object-contain shrink-0"
        />
        <div className="mx-6">
          <p className="text-xl font-semibold text-card-foreground">{ title }</p>
          <p className="text-sm text-muted-foreground">{ subtitle }</p>
        </div>
        <div className="ms-auto">
          { linked
            ? (
              <Badge className="text-green-600 border-green-400 dark:text-green-400">
                تم الربط بنجاح
              </Badge>
            )
            : <Button onClick={ () => setOpen(true) }>ابدأ الربط</Button> }
        </div>
      </div>

      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogContent className="max-w-xl">
          <EInvoicingRegister linkType={ linkType } onFinish={ handleFinish } />
        </DialogContent>
      </Dialog>
    </>
  );
}
