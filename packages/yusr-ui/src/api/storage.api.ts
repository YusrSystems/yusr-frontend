import type { StorageType } from "#/entities";
import { apiClient } from "./apiClient";


export interface PresignUploadResponse
{
	uploadUrl: string;
	readUrl: string;
	key: string;
}

export interface PresignDeleteResponse
{
	deleteUrl: string;
}

export class StorageApi
{
	static async getPresignedUploadUrl(
		pathPrefix: string,
		extension: string,
		contentType: string,
		storageType: StorageType
	): Promise<PresignUploadResponse>
	{
		const result = await apiClient.post<PresignUploadResponse>("/api/Storage/UploadUrl", {
			pathPrefix,
			extension,
			contentType,
			storageType
		});

		if (!result.ok || !result.data)
		{
			throw new Error("Failed to get upload URL");
		}

		return result.data;
	}

	static async getPresignedDeleteUrl(key: string, storageType: StorageType): Promise<PresignDeleteResponse>
	{
		const result = await apiClient.post<PresignDeleteResponse>("/api/Storage/DeleteUrl", {
			key,
			storageType
		});

		if (!result.ok || !result.data)
		{
			throw new Error("Failed to get delete URL");
		}

		return result.data;
	}

	static async upload(uploadUrl: string, file: File): Promise<void>
	{
		const res = await fetch(uploadUrl, {
			method: "PUT",
			headers: {"Content-Type": file.type || "application/octet-stream"},
			body: file
		});

		if (!res.ok)
		{
			throw new Error(`File upload failed: ${ res.status }`);
		}
	}

	static async delete(deleteUrl: string): Promise<void>
	{
		const res = await fetch(deleteUrl, {method: "DELETE"});
		if (!res.ok)
		{
			throw new Error(`File delete failed: ${ res.status }`);
		}
	}
}

export const storageApi = StorageApi;