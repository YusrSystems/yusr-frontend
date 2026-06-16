import { StorageFileField, StorageType, useStorageFile } from "yusr-ui";
import type Invoice from "@/core/data/invoices/invoice.ts";


export default function InvoiceFilesTab({invoice}: { invoice: Invoice })
{
	const {fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc} =
		useStorageFile(
			() => invoice.invoiceFiles.value,
			(value) => (invoice.invoiceFiles.value = value),
			StorageType.Private
		);

	return (
		<div className="w-full flex items-center justify-center shrink-0 bg-muted/10 p-4 rounded-lg border">
			<StorageFileField
				file={ invoice.invoiceFiles.value ?? [] }
				onFileChange={ handleFileChange }
				onRemove={ handleRemoveFile }
				onDownload={ handleDownload }
				getFileSrc={ getFileSrc }
				showPreview={ showFilePreview }
				fileInputRef={ fileInputRef }
			/>
		</div>
	);
}
