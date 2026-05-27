import type { StorageFile } from "../../../entities";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../pure/tooltip";

interface ImagePreviewProps {
  files?: StorageFile | StorageFile[];
  size?: number;
  fallback?: React.ReactNode;
}

function getFirstActiveFile(files?: StorageFile | StorageFile[]): StorageFile | undefined {
  const arr = Array.isArray(files) ? files : files ? [files] : [];
  return arr.find((f) => f.url && f.status !== 2);
}

function isPDF(file?: StorageFile): boolean {
  return file?.contentType === "application/pdf" || file?.extension?.toLowerCase() === ".pdf";
}

export function ImagePreview({ files, size = 40, fallback }: ImagePreviewProps) {
  const file = getFirstActiveFile(files);

  if (!file?.url) {
    return <>{fallback ?? <div style={{ width: size, height: size }} className="rounded bg-muted" />}</>;
  }

  const pdf = isPDF(file);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{ width: size, height: size }}
          className="shrink-0 rounded overflow-hidden border border-border cursor-zoom-in bg-muted"
        >
          {pdf ? (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
          ) : (
            <img src={file.url} alt="" className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
      </TooltipTrigger>

      <TooltipContent
        side="bottom"
        className="p-0 overflow-hidden border-border"
        style={{ width: pdf ? 300 : 400 }}
      >
        {pdf ? (
          <iframe
            src={file.url}
            title="PDF preview"
            className="border-none bg-white"
            style={{ width: 300, height: 420 }}
          />
        ) : (
          <img
            src={file.url}
            alt=""
            className="object-contain"
            style={{ width: 400, height: 300 }}
          />
        )}
      </TooltipContent>
    </Tooltip>
  );
}