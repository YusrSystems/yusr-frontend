import { Share2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../index";
import { cn } from "../../../utils/cn";
import { SidebarMenuButton, SidebarMenuItem } from "../../pure/sidebar";
import { QRCodeDisplay } from "./qrCodeDisplay";

/**
 * TODO: add real company info
 */
export function ShareMenuItem({ itemsFontSize = "text-base font-semibold" }: { itemsFontSize: string; })
{
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation("common");
  // take real company info
  return (
    <>
      <SidebarMenuItem key={ "share" }>
        <SidebarMenuButton asChild className="w-full justify-between h-12" onClick={ () => setIsDialogOpen(true) }>
          <div className="flex items-center justify-start gap-3 w-full px-3">
            <span className="flex items-center justify-center shrink-0 size-4">
              <Share2 />
            </span>

            <span className={ cn("truncate ps-2", itemsFontSize) }>
              { t("share") }
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
        <DialogContent>
          <DialogHeader className="pt-6 ps-6">
            <DialogTitle className="font-bold">{ t("share_company_info") }</DialogTitle>
          </DialogHeader>
          <QRCodeDisplay value="https://erp.yusrsys.com/" size={ 200 } className="mx-auto my-4" />
        </DialogContent>
      </Dialog>
    </>
  );
}
