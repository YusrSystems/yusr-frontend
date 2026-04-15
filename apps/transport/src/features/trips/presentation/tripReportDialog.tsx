import { Button, Checkbox, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label } from "@yusr_systems/ui";
import { Loader2, Printer, Share2 } from "lucide-react";

interface TripReportDialogProps
{
  title: string;
  label: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onPrint: (commission: number, showAmount: boolean) => void;
  onShare: (commission: number, showAmount: boolean) => void;
  isPrinting: boolean;
  isSharing: boolean;
  commission: number;
  setCommission: (value: number) => void;
  showAmount: boolean;
  setShowAmount: (value: boolean) => void;
}

export default function TripReportDialog(
  {
    title,
    label,
    isOpen,
    setIsOpen,
    onPrint,
    onShare,
    isPrinting,
    isSharing,
    commission,
    setCommission,
    showAmount,
    setShowAmount
  }: TripReportDialogProps
)
{
  return (
    <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
      <div className="flex items-center overflow-hidden rounded-md border bg-primary text-primary-foreground shadow-sm">
        { /* Action Buttons */ }
        <DialogTrigger asChild>
          <Button disabled={ isPrinting || isSharing } onClick={ () => setIsOpen(true) }>{ label }</Button>
        </DialogTrigger>
      </div>

      <DialogContent dir="rtl" className="sm:max-w-81.25">
        <DialogHeader>
          <DialogTitle className="text-right">{ title }</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2 text-right">
            <Label htmlFor="commission" className="text-xs">نسبة العمولة (%)</Label>
            <Input
              id="commission"
              type="number"
              className="text-right"
              value={ commission }
              onChange={ (e) => setCommission(Number(e.target.value)) }
            />
          </div>

          <div className="flex items-center justify-start gap-3 py-2 px-1 border rounded-md bg-muted/30">
            <Checkbox
              id="showAmount"
              checked={ showAmount }
              onCheckedChange={ (checked) => setShowAmount(!!checked) }
            />
            <Label htmlFor="showAmount" className="text-xs cursor-pointer">عرض المبالغ المالية</Label>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-2">
          <Button className="flex-1 gap-2" onClick={ () => onPrint(commission, showAmount) } disabled={ isPrinting }>
            { isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" /> }
            طباعة
          </Button>
          <Button
            variant="secondary"
            className="flex-1 gap-2"
            onClick={ () => onShare(commission, showAmount) }
            disabled={ isSharing }
          >
            { isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" /> }
            مشاركة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
