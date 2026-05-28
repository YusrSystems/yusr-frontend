import { QRCodeSVG } from "qrcode.react";
import { cn } from "../../../utils/cn";

interface QRCodeDisplayProps
{
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ value, size = 200, className }: QRCodeDisplayProps)
{
  if (!value)
  {
    return null;
  }

  return (
    <div className={ cn("flex items-center justify-center p-4 bg-white rounded-lg", className) }>
      <QRCodeSVG
        value={ value }
        size={ size }
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      />
    </div>
  );
}
