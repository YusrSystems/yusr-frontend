import { Download, FileText, Maximize2, UploadCloud, X } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import type { StorageFile } from "yusr-core";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Card, CardContent } from "../../pure/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../pure/carousel";
import { Dialog, DialogContent, DialogTrigger } from "../../pure/dialog";
import { Input } from "../../pure/input";

interface StorageFileFieldProps {
  label: string;
  file: StorageFile | StorageFile[] | undefined;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Passes index and file, but perfectly accepts your hook's () => void
  onRemove: (index: number, file: StorageFile) => void;
  onDownload: (e: React.MouseEvent, file: StorageFile | undefined) => void;
  getFileSrc: (file: StorageFile | undefined) => string;
  showPreview: (file: StorageFile | undefined) => boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  error?: string;
  isInvalid?: boolean;
  dir?: "rtl" | "ltr";
}

export function isPDF(file?: StorageFile): boolean {
  return file?.contentType === "application/pdf" || file?.extension?.toLowerCase() === ".pdf";
}

export function StorageFileField(
  {
    label,
    file,
    onFileChange,
    onRemove,
    onDownload,
    getFileSrc,
    showPreview,
    fileInputRef,
    error,
    isInvalid,
    dir = "rtl"
  }: StorageFileFieldProps
) {
  // 1. Normalize to array
  const filesArray = useMemo(() => {
    return Array.isArray(file) ? file : file ? [file] : [];
  }, [file]);

  // 2. Filter active files using YOUR hook's logic
  const activeFiles = useMemo(() => {
    return filesArray.filter((f) => showPreview(f));
  }, [filesArray, showPreview]);

  // 3. Handle file input change and reset the input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e);
    // Reset input so the same file can be selected again if removed
    if (e.target) {
      e.target.value = "";
    }
  }, [onFileChange]);

  // 4. Render Preview (Image or PDF)
  const renderPreview = useCallback((f: StorageFile) => {
    const isPdf = isPDF(f);
    const src = getFileSrc(f);

    if (isPdf) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
          <FileText className="h-12 w-12 text-red-500 mb-2" />
          <span className="text-[10px] font-medium text-muted-foreground px-2 truncate w-full text-center">
            PDF Document
          </span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt="File preview"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }, [getFileSrc]);

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-muted-foreground pb-10">{label}</label>

      {activeFiles.length > 0
        ? (
          <div className="space-y-2 max-w-100 mt-3">
            <Carousel opts={{ direction: dir, align: "start", dragFree: true }} className="w-full relative group">
              <CarouselContent>
                {activeFiles.map((f, index) => {
                  // Generate a safe, unique key
                  const uniqueKey = f.url || (f.base64File ? f.base64File.substring(0, 40) : `fallback-key-${index}`);
                  const originalIndex = filesArray.indexOf(f);

                  return (
                    <CarouselItem key={uniqueKey} className="basis-full">
                      <div className="p-1">
                        <Card className="relative group overflow-hidden border-2 aspect-video flex items-center justify-center bg-background shadow-sm">
                          <CardContent className="p-0 w-full h-full flex items-center justify-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="cursor-zoom-in w-full h-full relative group">
                                  {renderPreview(f)}
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="text-white w-6 h-6" />
                                  </div>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[80vw] sm:w-[80vw] sm:h-[80vh] p-0 bg-background/95 border-none shadow-2xl overflow-hidden flex items-center justify-center">
                                {f.contentType === "application/pdf" || f.extension?.toLowerCase() === ".pdf"
                                  ? (
                                    <iframe
                                      src={getFileSrc(f)}
                                      title="PDF Preview"
                                      className="w-full h-full border-none bg-white"
                                    />
                                  )
                                  : (
                                    <div className="relative w-full h-full flex items-center justify-center p-4">
                                      <img
                                        alt="Full view"
                                        src={getFileSrc(f)}
                                        className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
                                      />
                                    </div>
                                  )}
                              </DialogContent>
                            </Dialog>

                            { /* Action Buttons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-30">
                              <Button
                                type="button"
                                size="icon"
                                className="h-7 w-7 rounded-full shadow-lg bg-red-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemove(originalIndex, f);
                                }}
                                aria-label="Remove file"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                className="h-7 w-7 rounded-full shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDownload(e, f);
                                }}
                                aria-label="Download file"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {activeFiles.length > 1 && (
                <>
                  <CarouselPrevious className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-40 bg-background/80 hover:bg-background" />
                  <CarouselNext className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-40 bg-background/80 hover:bg-background" />
                </>
              )}
            </Carousel>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-[10px] h-8 border-dashed border-2 hover:bg-muted"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="ml-2 h-4 w-4" />
              تغيير / إضافة صورة
            </Button>
          </div>
        )
        : (
          /* Empty State */
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center w-100 mt-3 h-50 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-muted/5",
              isInvalid && "border-red-500 bg-red-50"
            )}
          >
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground font-medium">ارفع الملفات</span>
            <span className="text-[10px] text-muted-foreground/60 mt-1">يمكنك اختيار ملفات (صور ، PDF)</span>
          </div>
        )}

      {isInvalid && error && <p className="text-[10px] text-red-500 font-medium mr-1">{error}</p>}

      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,application/pdf"
        onChange={handleFileChange}
        multiple={true} // Left as true so it works if you upgrade your hook to arrays later
      />
    </div>
  );
}
