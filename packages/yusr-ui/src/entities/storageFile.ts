export class StorageFile
{
  public key!: string;
  public url: string | null = null;
  public file?: File;
  public base64File: string | null = null;
  public extension: string | null = null;
  public contentType: string | null = null;
  public status: StorageFileStatus = StorageFileStatus.Unchanged;

  constructor(init?: Partial<StorageFile>)
  {
    Object.assign(this, init);
  }
}

export const StorageFileStatus = { Unchanged: 0, New: 1, Delete: 2 } as const;

export type StorageFileStatus = typeof StorageFileStatus[keyof typeof StorageFileStatus];

export const StorageType = { Public: 0, Private: 1 } as const;

export type StorageType = typeof StorageType[keyof typeof StorageType];