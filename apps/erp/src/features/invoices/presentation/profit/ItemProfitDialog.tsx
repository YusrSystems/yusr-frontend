import { Banknote } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "yusr-ui";
import { InvoiceItem } from "../../../../core/data/invoice";
import type { InvoiceItemProfitResult } from "../../../../core/data/InvoiceItemProfitResult";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import { ProfitRow } from "./InvoiceProfitDialog";

interface ItemProfitDialogProps
{
  item: InvoiceItem;
}

export function ItemProfitDialog({ item }: ItemProfitDialogProps)
{
  const [open, setOpen] = useState(false);

  const profit: InvoiceItemProfitResult = InvoiceItemsMath.CalcInvoiceItemProfit(item);

  return (
    <>
      <button
        type="button"
        onClick={ () => setOpen(true) }
        className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-500/10 rounded-md transition-colors"
        aria-label="عرض ربح المادة"
      >
        <Banknote className="h-5 w-5" />
      </button>

      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogContent className="max-w-sm rtl" dir="rtl">
          <DialogHeader>
            <DialogTitle>ربح المادة</DialogTitle>
            <DialogDescription>{ item.itemName }</DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <ProfitRow label="السعر شامل الضريبة" value={ profit.taxInclusivePrice } />
            <ProfitRow label="التكلفة" value={ profit.cost } />
            <ProfitRow label="إجمالي الضرائب" value={ profit.totalTaxesAmount } />
            <ProfitRow label="الكمية" value={ profit.quantity } showCurrency={ false } />
            <ProfitRow label="الربح لكل وحدة" value={ profit.profit } variant="profit" />
            <ProfitRow label="إجمالي الربح" value={ profit.totalProfit } variant="profit" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
