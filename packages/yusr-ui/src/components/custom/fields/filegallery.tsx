import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { useState } from "react";
import { type StorageFile, StorageFileStatus } from "../../../entities";
import { Dialog, DialogContent } from "../../pure/dialog";

interface FileGalleryProps
{
  file: StorageFile | StorageFile[] | undefined;
}

function getSrc(file: StorageFile): string
{
  if (file.url)
  {
    return file.url;
  }
  if (file.base64File)
  {
    return `data:${file.contentType ?? "image/jpeg"};base64,${file.base64File}`;
  }
  return "";
}

export function FileGallery({ file }: FileGalleryProps)
{
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const files = (Array.isArray(file) ? file : file ? [file] : [])
    .filter((f) => f.status !== StorageFileStatus.Delete && getSrc(f));

  if (!files.length)
  {
    return (
      <div className="w-8 h-8 rounded border border-dashed border-border flex items-center justify-center bg-muted/30">
        <ImageOff className="w-4 h-4 text-muted-foreground/50" />
      </div>
    );
  }

  function open(index: number)
  {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function goPrev()
  {
    setActiveIndex((i) => (i - 1 + files.length) % files.length);
  }

  function goNext()
  {
    setActiveIndex((i) => (i + 1) % files.length);
  }

  return (
    <>
      { /* Strip of thumbnails */ }
      <div className="flex items-center gap-1">
        { files.map((f, i) => (
          <button
            key={ i }
            type="button"
            onClick={ () => open(i) }
            className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border hover:opacity-80 transition-opacity"
          >
            <img
              src={ getSrc(f) }
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        )) }
      </div>

      { /* Slider dialog */ }
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-black border-none">
          { /* Header */ }
          <div className="flex items-center justify-between px-4 py-2 bg-black/80">
            <span className="text-white/60 text-sm">{ activeIndex + 1 } / { files.length }</span>
            <button
              type="button"
              onClick={ () => setIsOpen(false) }
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          { /* Image */ }
          <div className="relative flex items-center justify-center bg-black" style={ { minHeight: "60vh" } }>
            <img
              src={ getSrc(files[activeIndex]) }
              alt=""
              className="max-w-full max-h-[70vh] object-contain"
            />

            { files.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={ goPrev }
                  className="absolute left-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={ goNext }
                  className="absolute right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) }
          </div>

          { /* Thumbnail strip */ }
          { files.length > 1 && (
            <div className="flex gap-2 justify-center px-4 py-3 bg-black/80 overflow-x-auto">
              { files.map((f, i) => (
                <button
                  key={ i }
                  type="button"
                  onClick={ () => setActiveIndex(i) }
                  className={ `w-10 h-10 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === activeIndex ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
                  }` }
                >
                  <img src={ getSrc(f) } alt="" className="w-full h-full object-cover" />
                </button>
              )) }
            </div>
          ) }
        </DialogContent>
      </Dialog>
    </>
  );
}
