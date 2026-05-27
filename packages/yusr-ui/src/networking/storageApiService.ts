import { YusrApiHelper } from "./yusrApiHelper";

interface PresignUploadResponse
{
  uploadUrl: string;
  readUrl: string;
  key: string;
}

interface PresignDeleteResponse
{
  deleteUrl: string;
}

export class StorageApiService
{
  static async getPresignedUploadUrl(
    pathPrefix: string,
    extension: string,
    contentType: string
  ): Promise<PresignUploadResponse>
  {
    const result = await YusrApiHelper.Post<PresignUploadResponse>(`/api/Storage/UploadUrl`, {
      pathPrefix,
      extension,
      contentType
    });
    if (!result.data)
    {
      throw new Error("Failed to get upload URL");
    }
    return result.data;
  }

  static async getPresignedDeleteUrl(key: string): Promise<PresignDeleteResponse>
  {
    const result = await YusrApiHelper.Post<PresignDeleteResponse>("/api/Storage/DeleteUrl", { key });

    if (!result.data)
    {
      throw new Error("Failed to get delete URL");
    }
    return result.data;
  }

  static async upload(uploadUrl: string, file: File): Promise<void>
  {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file
    });

    if (!res.ok)
    {
      throw new Error(`file upload failed: ${res.status}`);
    }
  }

  static async delete(deleteUrl: string): Promise<void>
  {
    const res = await fetch(deleteUrl, { method: "DELETE" });
    if (!res.ok)
    {
      throw new Error(`file delete failed: ${res.status}`);
    }
  }
}
