import { useRef } from "react";
import { StorageFile, StorageFileStatus } from "@yusr_systems/core";

export function useStorageFile<T>(setFormData: React.Dispatch<React.SetStateAction<T>>, fieldName: keyof T)
{
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) =>
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
        errorMessages.push(`الملف "${file.name}" كبير جداً.`);
        continue;
      }
      if (!allowedTypes.includes(file.type))
      {
        errorMessages.push(`نوع الملف "${file.name}" غير مدعوم.`);
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

    // قراءة الملفات وتحويلها لـ StorageFile
    const filePromises = validFiles.map((file) =>
    {
      return new Promise<StorageFile>((resolve) =>
      {
        const reader = new FileReader();
        reader.onloadend = () =>
        {
          const base64String = reader.result as string;
          resolve(
            new StorageFile({
              url: base64String,
              base64File: base64String.split(",")[1],
              extension: `.${file.name.split(".").pop()}`,
              contentType: file.type,
              status: StorageFileStatus.New
            })
          );
        };
        reader.readAsDataURL(file);
      });
    });

    const newStorageFiles = await Promise.all(filePromises);

    setFormData((prev) =>
    {
      const existingData = prev[fieldName];

      // المنطق الجوهري: إذا كان الحقل مصفوفة، أضف الملفات. إذا لم يكن، خذ أول ملف فقط.
      let newValue: any;
      if (Array.isArray(existingData))
      {
        newValue = [...existingData, ...newStorageFiles];
      }
      else
      {
        newValue = newStorageFiles[0];
      }

      return { ...prev, [fieldName]: newValue };
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
      const existingData = prev[fieldName];

      if (Array.isArray(existingData))
      {
        const newFiles = [...existingData];
        const fileToRemove = newFiles[index];

        if (fileToRemove.status === StorageFileStatus.New)
        {
          newFiles.splice(index, 1);
        }
        else
        {
          newFiles[index] = new StorageFile({ ...fileToRemove, status: StorageFileStatus.Delete });
        }
        return { ...prev, [fieldName]: newFiles as any };
      }
      else
      {
        // إذا كان ملفاً واحداً
        const currentFile = existingData as unknown as StorageFile;
        return {
          ...prev,
          [fieldName]: currentFile?.status === StorageFileStatus.New
            ? undefined
            : new StorageFile({ ...currentFile, status: StorageFileStatus.Delete }) as any
        };
      }
    });
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

  return { fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc };
}
