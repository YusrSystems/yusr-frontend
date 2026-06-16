import { Download, FileText, Maximize2, UploadCloud, X } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { StorageFile } from "../../../entities";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Card, CardContent } from "../../pure/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../pure/carousel";
import { Dialog, DialogContent, DialogTrigger } from "../../pure/dialog";
import { InputOld } from "../../pure/input";


interface StorageFileAction
{
	icon: React.ReactNode;
	label: string;
	className?: string;
	onClick: (index: number, file: StorageFile) => void;
}

interface StorageFileFieldProps
{
	label?: string;
	file: StorageFile | StorageFile[] | undefined;
	onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onRemove: (index: number, file: StorageFile) => void;
	onDownload: (e: React.MouseEvent, file: StorageFile | undefined) => void;
	getFileSrc: (file: StorageFile | undefined) => string;
	showPreview: (file: StorageFile | undefined) => boolean;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	extraActions?: StorageFileAction[];
	error?: string;
	isInvalid?: boolean;
	dir?: "rtl" | "ltr";
	mode?: "show" | "edit";
}

export function isPDF(file?: StorageFile): boolean
{
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
		extraActions,
		error,
		isInvalid,
		dir = "rtl",
		mode = "edit"
	}: StorageFileFieldProps
)
{
	const {t} = useTranslation("common");

	// 1. Normalize to array
	const filesArray = useMemo(() =>
	{
		return Array.isArray(file) ? file : file ? [file] : [];
	}, [file]);

	// 2. Filter active files using YOUR hook's logic
	const activeFiles = useMemo(() =>
	{
		return filesArray.filter((f) => showPreview(f));
	}, [filesArray, showPreview]);

	// 3. Handle file input change and reset the input
	const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
	{
		onFileChange(e);
		// Reset input so the same file can be selected again if removed
		if (e.target)
		{
			e.target.value = "";
		}
	}, [onFileChange]);

	// 4. Render Preview (Image or PDF)
	const renderPreview = useCallback((f: StorageFile) =>
	{
		const isPdf = isPDF(f);
		const src = getFileSrc(f);

		if (isPdf)
		{
			return (
				<div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
					<FileText className="h-12 w-12 text-red-500 mb-2"/>
					<span className="text-[10px] font-medium text-muted-foreground px-2 truncate w-full text-center">
            { t("storageFileField.pdfDocument") }
          </span>
				</div>
			);
		}

		return (
			<img
				src={ src }
				alt={ t("storageFileField.filePreview") }
				loading="lazy"
				className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		);
	}, [getFileSrc, t]);

	return (
		<div className="space-y-3">
			{ label && (
				<label className="text-xs font-medium text-muted-foreground pb-10">{ label }</label>
			) }

			{ activeFiles.length > 0
				? (
					<div className="space-y-2 w-100 max-w-100 mt-3">
						<Carousel opts={ {direction: dir, align: "start", dragFree: true} }
						          className="w-full relative group">
							<CarouselContent>
								{ activeFiles.map((f, index) =>
								{
									// Generate a safe, unique key
									const uniqueKey = f.url || (f.base64File ? f.base64File.substring(0, 40) : `fallback-key-${ index }`);
									const originalIndex = filesArray.indexOf(f);

									return (
										<CarouselItem key={ uniqueKey } className="basis-full">
											<div className="p-1">
												<Card
													className="relative group overflow-hidden border-2 aspect-video flex items-center justify-center bg-background shadow-sm">
													<CardContent
														className="p-0 w-full h-full flex items-center justify-center">
														<Dialog>
															<DialogTrigger asChild>
																<div
																	className="cursor-zoom-in w-full h-full relative group">
																	{ renderPreview(f) }
																	<div
																		className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
																		<Maximize2 className="text-white w-6 h-6"/>
																	</div>
																</div>
															</DialogTrigger>
															<DialogContent
																className="sm:max-w-[80vw] sm:w-[80vw] sm:h-[80vh] p-0 bg-background/95 border-none shadow-2xl overflow-hidden flex items-center justify-center">
																{ f.contentType === "application/pdf" || f.extension?.toLowerCase() === ".pdf"
																	? (
																		<iframe
																			src={ getFileSrc(f) }
																			title={ t("storageFileField.pdfPreview") }
																			className="w-full h-full border-none bg-white"
																		/>
																	)
																	: (
																		<div
																			className="relative w-full h-full flex items-center justify-center p-4">
																			<img
																				alt={ t("storageFileField.fullView") }
																				src={ getFileSrc(f) }
																				className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
																			/>
																		</div>
																	) }
															</DialogContent>
														</Dialog>

														{ /* Action Buttons */ }
														<div
															className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-30">
															{ /* Delete */ }
															<Button
																type="button"
																size="icon"
																className="h-7 w-7 rounded-full shadow-lg bg-red-600 text-white"
																onClick={ (e) =>
																{
																	e.stopPropagation();
																	onRemove(originalIndex, f);
																} }
																aria-label={ t("storageFileField.removeFile") }
															>
																<X className="h-4 w-4"/>
															</Button>

															{ /* Download */ }
															<Button
																type="button"
																size="icon"
																variant="secondary"
																className="h-7 w-7 rounded-full shadow-lg"
																onClick={ (e) =>
																{
																	e.stopPropagation();
																	onDownload(e, f);
																} }
																aria-label={ t("storageFileField.downloadFile") }
															>
																<Download className="h-4 w-4"/>
															</Button>

															{ /* Extra actions */ }
															{ extraActions?.map((action, i) => (
																<Button
																	key={ i }
																	type="button"
																	size="icon"
																	className={ cn("h-7 w-7 rounded-full shadow-lg", action.className) }
																	onClick={ (e) =>
																	{
																		e.stopPropagation();
																		action.onClick(originalIndex, f);
																	} }
																	aria-label={ action.label }
																>
																	{ action.icon }
																</Button>
															)) }
														</div>
													</CardContent>
												</Card>
											</div>
										</CarouselItem>
									);
								}) }
							</CarouselContent>

							{ activeFiles.length > 1 && (
								<>
									<CarouselPrevious
										className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-40 bg-background/80 hover:bg-background"/>
									<CarouselNext
										className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-40 bg-background/80 hover:bg-background"/>
								</>
							) }
						</Carousel>

						<Button
							type="button"
							variant="outline"
							size="sm"
							className="w-full text-[10px] h-8 border-dashed border-2 hover:bg-muted"
							onClick={ () => fileInputRef.current?.click() }
						>
							<UploadCloud className="ml-2 h-4 w-4"/>
							{ t("storageFileField.changeOrAddImage") }
						</Button>
					</div>
				)
				: (
					/* Empty State */
					<div
						onClick={ () => fileInputRef.current?.click() }
						className={ cn(
							"flex flex-col items-center justify-center w-100 mt-3 h-50 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-muted/5",
							isInvalid && "border-red-500 bg-red-50"
						) }
					>
						<UploadCloud className="h-8 w-8 text-muted-foreground mb-2"/>
						<span
							className="text-xs text-muted-foreground font-medium">{ t("storageFileField.uploadFiles") }</span>
						<span
							className="text-[10px] text-muted-foreground/60 mt-1">{ t("storageFileField.uploadHint") }</span>
					</div>
				) }

			{ isInvalid && error && <p className="text-[10px] text-red-500 font-medium mr-1">{ error }</p> }

			{ mode === "edit" && (
				<InputOld
					type="file"
					ref={ fileInputRef }
					className="hidden"
					accept="image/jpeg,image/png,image/gif,application/pdf"
					onChange={ handleFileChange }
					multiple={ true }
				/>
			) }
		</div>
	);
}
