import { ZoomIn } from "lucide-react";

interface ZoomableImageProps
{
  srcLight: string;
  srcDark: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  onOpen: (srcLight: string, srcDark: string, alt: string) => void;
}

export function ZoomableImage(
  { srcLight, srcDark, alt, className, wrapperClassName, onOpen }: ZoomableImageProps
)
{
  return (
    <div
      className={ `group/zoom relative cursor-zoom-in overflow-hidden ${wrapperClassName ?? ""}` }
      onClick={ () => onOpen(srcLight, srcDark, alt) }
      title="انقر للتكبير"
    >
      { /* Zoom hint overlay */ }
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/zoom:opacity-100 bg-foreground/10">
        <div className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow backdrop-blur-sm">
          <ZoomIn className="h-3.5 w-3.5" />
          تكبير
        </div>
      </div>
      <img
        src={ srcLight }
        alt={ alt }
        className={ `block dark:hidden transition-transform duration-300 group-hover/zoom:scale-105 ${
          className ?? ""
        }` }
      />
      <img
        src={ srcDark }
        alt={ alt }
        className={ `hidden dark:block transition-transform duration-300 group-hover/zoom:scale-105 ${
          className ?? ""
        }` }
      />
    </div>
  );
}
