import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StorageFile, StorageFileStatus, StorageType } from "../entities";
import { StorageApiService } from "../networking/storageApiService";

export function useStorageFile<T>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  fieldName: keyof T,
  storageType: StorageType,
  multiple: boolean = true
)
{
  const { t } = useTranslation("common");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    const files = Array.from(event.target.files || []);
    if (files.length === 0)
    {
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

    const validFiles: File[] = [];
    const errorMessages: string[] = [];

    for (const file of files)
    {
      if (file.size > maxSizeInBytes)
      {
        errorMessages.push(t("storageFile.fileTooLarge", { name: file.name }));
        continue;
      }
      if (!allowedTypes.includes(file.type))
      {
        errorMessages.push(t("storageFile.fileTypeNotSupported", { name: file.name }));
        continue;
      }
      validFiles.push(file);
    }

    if (errorMessages.length > 0)
    {
      alert(errorMessages.join("\n"));
    }
    if (validFiles.length === 0)
    {
      return;
    }

    const newStorageFiles: StorageFile[] = validFiles.map((file) =>
      new StorageFile({
        file: file,
        url: URL.createObjectURL(file),
        extension: `.${file.name.split(".").pop()}`,
        contentType: file.type,
        status: StorageFileStatus.New
      })
    );

    setFormData((prev) =>
    {
      const existingData = prev[fieldName];
      const existingArray: StorageFile[] = Array.isArray(existingData)
        ? existingData
        : existingData
        ? [existingData as unknown as StorageFile]
        : [];

      const newValue = multiple
        ? [...existingArray, ...newStorageFiles]
        : newStorageFiles[0];

      return { ...prev, [fieldName]: newValue as any };
    });

    if (fileInputRef.current)
    {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) =>
  {
    setFormData((prev) =>
    {
      const value = prev[fieldName];

      const removeFile = (file: StorageFile) =>
      {
        if (file.status === StorageFileStatus.New)
        {
          URL.revokeObjectURL(file.url ?? "");
          return undefined;
        }

        return new StorageFile({
          ...file,
          status: StorageFileStatus.Delete
        });
      };

      if (Array.isArray(value))
      {
        const files = [...value];
        const updated = removeFile(files[index]);

        if (updated === undefined)
        {
          files.splice(index, 1);
        }
        else
        {
          files[index] = updated;
        }

        return {
          ...prev,
          [fieldName]: files as any
        };
      }
      return {
        ...prev,
        [fieldName]: removeFile(value as StorageFile) as any
      };
    });
  };

  const commitFiles = async (
    files: StorageFile | StorageFile[] | undefined,
    pathPrefix: string
  ): Promise<StorageFile[]> =>
  {
    const arr: StorageFile[] = Array.isArray(files) ? files : files ? [files] : [];

    const results = await Promise.all(
      arr.map(async (f): Promise<StorageFile | null> =>
      {
        switch (f.status)
        {
          case StorageFileStatus.New:
          {
            if (!f.file)
            {
              return null;
            }

            const { uploadUrl, readUrl, key } = await StorageApiService.getPresignedUploadUrl(
              pathPrefix,
              f.extension ?? ".bin",
              f.contentType ?? "application/octet-stream",
              storageType
            );
            const cacheHeader = storageType === StorageType.Private
              ? "private, no-cache, no-store, must-revalidate"
              : "public, max-age=31536000, immutable";

            const uploadRes = await fetch(uploadUrl, {
              method: "PUT",
              headers: {
                "Content-Type": f.contentType ?? "application/octet-stream",
                cacheHeader
              },
              body: f.file
            });

            if (!uploadRes.ok)
            {
              throw new Error(`Upload failed for ${f.file.name}`);
            }

            URL.revokeObjectURL(f.url ?? "");

            return new StorageFile({
              key,
              url: readUrl,
              extension: f.extension,
              contentType: f.contentType,
              status: StorageFileStatus.Unchanged
            });
          }

          case StorageFileStatus.Delete:
          {
            const keyToDelete = f.key ?? f.url; // fallback to url if key missing
            if (keyToDelete)
            {
              const { deleteUrl } = await StorageApiService.getPresignedDeleteUrl(keyToDelete, storageType);
              await StorageApiService.delete(deleteUrl);
            }
            return null;
          }

          case StorageFileStatus.Unchanged:
            return f;

          default:
            return f;
        }
      })
    );

    return results.filter((f): f is StorageFile => f !== null);
  };

  const getFileSrc = (file: StorageFile | undefined) =>
  {
    return file?.url || (file?.base64File ? `data:${file.contentType};base64,${file.base64File}` : "");
  };

  const showFilePreview = (file: StorageFile | undefined): boolean =>
  {
    return !!(file?.url && file.status !== StorageFileStatus.Delete);
  };

  const handleDownload = async (e: React.MouseEvent, file: StorageFile | undefined) =>
  {
    e.stopPropagation();
    const fileSrc = getFileSrc(file);
    if (!fileSrc)
    {
      return;
    }
    try
    {
      const response = await fetch(fileSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `file_${Date.now()}.${file?.contentType?.split("/")[1] || "png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }
    catch
    {
      window.open(fileSrc, "_blank");
    }
  };

  const handleSetPrimary = (index: number) =>
  {
    setFormData((prev) =>
    {
      const value = prev[fieldName];
      if (!Array.isArray(value) || index === 0)
      {
        return prev;
      }

      const files = [...value];
      // Swap with index 0
      [files[0], files[index]] = [files[index], files[0]];

      return { ...prev, [fieldName]: files as any };
    });
  };

  return {
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    commitFiles,
    handleDownload,
    showFilePreview,
    handleSetPrimary,
    getFileSrc
  };
}
