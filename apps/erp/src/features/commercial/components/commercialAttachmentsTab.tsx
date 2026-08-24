import { StorageFileField, StorageType, useStorageFile } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import type {
	CommercialDocument,
	ICommercialDocument,
	ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";


export interface CommercialAttachmentsTabProps<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>
{
	document: CommercialDocument<TDto, TItem, TItemDto>;
}

export function CommercialAttachmentsTab<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>({
	document
}: CommercialAttachmentsTabProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc} =
		useStorageFile(
			() => document.files.value,
			(value) => (document.files.value = value),
			StorageType.Private
		);

	return (
		<div className="w-full flex items-center justify-center shrink-0 bg-muted/10 p-4 rounded-lg border">
			<StorageFileField
				file={ document.files.value ?? [] }
				onFileChange={ handleFileChange }
				onRemove={ handleRemoveFile }
				onDownload={ handleDownload }
				getFileSrc={ getFileSrc }
				showPreview={ showFilePreview }
				fileInputRef={ fileInputRef }
				error={ document.getError("files") }
			/>
		</div>
	);
}