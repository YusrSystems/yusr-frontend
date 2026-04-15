import { X } from "lucide-react";
import { useEffect } from "react";

interface LightboxProps
{
  srcLight: string;
  srcDark: string;
  alt: string;
  onClose: () => void;
}

export function Lightbox({ srcLight, srcDark, alt, onClose }: LightboxProps)
{
  useEffect(() =>
  {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () =>
    {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 md:p-10"
      onClick={ onClose }
    >
      <button
        className="absolute top-4 left-4 rounded-full bg-muted p-2 text-foreground hover:bg-accent transition-colors"
        onClick={ onClose }
        aria-label="إغلاق"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        className="relative max-h-full max-w-6xl w-full overflow-hidden rounded-xl border border-border shadow-2xl"
        onClick={ (e) => e.stopPropagation() }
      >
        <img src={ srcLight } alt={ alt } className="block dark:hidden w-full h-auto object-contain" />
        <img src={ srcDark } alt={ alt } className="hidden dark:block w-full h-auto object-contain" />
      </div>
    </div>
  );
}
