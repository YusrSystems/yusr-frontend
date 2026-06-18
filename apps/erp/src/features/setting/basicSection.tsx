import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { differenceInDays, format } from "date-fns";
import { Camera, Check, Copy, Download, Share2, Trash2, Upload } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	BranchesSearchableSelect,
	Button,
	cn,
	FieldGroup,
	FieldsSection,
	FormField,
	i18n,
	Label,
	StorageFileStatus,
	StorageType,
	TextField,
	useStorageFile
} from "yusr-ui";
import type { Setting } from "@/core/data/setting.ts";
import type { Signal } from "@preact/signals-react";


export default function BasicSection({formData}: { formData: Setting })
{
	useSignals();

	const {t} = useTranslation("erpCommon");
	const [isCopied, setIsCopied] = useState(false);
	const qrRef = useRef<HTMLDivElement>(null);

	const {fileInputRef, handleFileChange, handleRemoveFile} = useStorageFile(
		() => formData.logo.value ? [formData.logo?.value] : [],
		(value) => (formData.logo.value = value[0]),
		StorageType.Public,
		false
	);

	const shareUrl = `${ window.location.origin }/sharing/${ formData.registrationKey.value }`;

	const handleCopyLink = async () =>
	{
		await navigator.clipboard.writeText(shareUrl);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	const handleDownloadQR = () =>
	{
		const canvas = qrRef.current?.querySelector("canvas");
		if (!canvas)
		{
			return;
		}

		const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		const downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = `QR-${ formData.companyName.value || "Company" }.png`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};

	const getDaysLeftText = (daysLeft: number) =>
	{
		if (daysLeft > 0)
		{
			return t("settings.daysLeft", {days: daysLeft});
		}
		return t("settings.expired");
	};

	const getDaysStatusColor = (daysLeft: number) =>
	{
		if (daysLeft > 10)
		{
			return "text-green-600 dark:text-green-400";
		}
		if (daysLeft > 0)
		{
			return "text-yellow-600 dark:text-yellow-400";
		}
		return "text-red-600 dark:text-red-400";
	};

	const getDaysBgColor = (daysLeft: number) =>
	{
		if (daysLeft > 10)
		{
			return "bg-green-50 dark:bg-green-950/30";
		}
		if (daysLeft > 0)
		{
			return "bg-yellow-50 dark:bg-yellow-950/30";
		}
		return "bg-red-50 dark:bg-red-950/30";
	};

	return (
		<div className="space-y-5 animate-in fade-in">
			{ /* LOGO SECTION */ }
			<div
				className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 p-4 rounded-xl border bg-muted/10 shadow-sm">
				{ /* Logo Part */ }
				<div className="flex flex-col md:flex-row items-center gap-6">
					<Avatar className="h-32 w-32 border-4 border-background shadow-md">
						<AvatarImage
							src={ formData.logo.value?.status !== StorageFileStatus.Delete ? formData.logo.value?.url || "" : "" }
							className="object-cover bg-white"
						/>
						<AvatarFallback className="bg-secondary">
							<Camera className="h-10 w-10 text-muted-foreground"/>
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col gap-3 text-center md:text-start">
						<h3 className="text-lg font-bold">{ t("settings.companyLogo") }</h3>
						<p className="text-sm text-muted-foreground">{ t("settings.companyLogoDescription") }</p>

						<div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
							{ (!formData.logo.value?.url || formData.logo.value.status === StorageFileStatus.Delete) && (
								<Button
									type="button"
									variant="secondary"
									size="sm"
									onClick={ () => fileInputRef.current?.click() }
								>
									<Upload className="h-4 w-4 ms-2"/> { t("settings.uploadImage") }
								</Button>
							) }

							{ formData.logo.value?.url && formData.logo.value.status !== StorageFileStatus.Delete && (
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={ () => handleRemoveFile(0) }
								>
									<Trash2 className="h-4 w-4 ms-2"/> { t("settings.delete") }
								</Button>
							) }
						</div>
						<p className="text-xs text-muted-foreground">{ t("settings.logoHint") }</p>
						<input
							type="file"
							ref={ fileInputRef }
							className="hidden"
							aria-label={ t("settings.uploadCompanyLogo") }
							accept="image/*"
							onChange={ handleFileChange }
						/>
					</div>
				</div>

				{ /* Sharing Part (Beside Logo) */ }
				{ shareUrl && (
					<div
						className="flex flex-col items-center gap-3 w-full md:w-auto bg-muted/20 p-3 rounded-lg border">
						<div className="flex items-center gap-2 text-primary font-semibold">
							<Share2 className="h-4 w-4"/>
							<span className="text-sm">{ t("settings.shareInfoCard") }</span>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full md:w-auto">
							<div ref={ qrRef } className="bg-white p-2 rounded border shadow-sm shrink-0">
								<QRCodeCanvas
									value={ shareUrl }
									size={ 100 }
									level="H"
								/>
							</div>

							<div className="flex flex-col gap-2 w-full sm:w-auto min-w-35">
								<Button
									type="button"
									variant={ isCopied ? "default" : "default" }
									size="sm"
									className={ `${ isCopied ? "bg-green-600 hover:bg-green-700" : "" }` }
									onClick={ handleCopyLink }
								>
									{ isCopied ? <Check className="h-4 w-4 me-2"/> : <Copy className="h-4 w-4 me-2"/> }
									{ isCopied ? t("settings.copied") : t("settings.copyLink") }
								</Button>

								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={ handleDownloadQR }
								>
									<Download className="h-4 w-4 me-2"/>
									{ t("settings.download", "تحميل الرمز") }
								</Button>
							</div>
						</div>
						<a
							href={ shareUrl }
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-blue-600 hover:text-primary text-center"
						>
							{ shareUrl }
						</a>
					</div>
				) }
			</div>

			{ /* BASIC INFO */ }
			<FieldGroup>
				<FieldsSection title={ t("settings.basicData") } columns={ 2 }>
					<TextField
						label={ t("settings.companyName") }
						required
						value={ formData.companyName }
						error={ formData.getError("companyName") }
					/>
					<TextField
						label={ t("settings.businessActivity") }
						value={ formData.companyBusinessCategory }
					/>
					<div>
						{ !Services.auth.setting?.companyPhone?.value && (
							<FieldNoticeablePing
								isError={ formData.getError("companyPhone") }
								onClick={ () =>
								{
									toast.info(i18n.t("common:accountVerification.enterPhoneToVerify"));
								} }
							/>
						) }
						<TextField
							label={ t("settings.companyPhone") }
							required
							value={ formData.companyPhone }
							error={ formData.getError("companyPhone") }
						/>
					</div>
					<TextField
						label={ t("settings.email") }
						required
						type="email"
						value={ formData.email }
						error={ formData.getError("email") }
					/>
					<FormField label={ t("settings.mainBranch") } required>
						<BranchesSearchableSelect
							id={ formData.branchId }
							label={ formData.branch.value?.name }
							onSelect={ (branch) =>
							{
								formData.branch.value = branch;
							} }
						/>
					</FormField>

					<TextField
						label={ t("settings.commercialRegistration") }
						value={ formData.crn }
					/>
					<TextField
						label={ t("settings.taxNumber") }
						value={ formData.vatNumber }
					/>
				</FieldsSection>
			</FieldGroup>

			{ /* SUBSCRIPTION */ }
			<div className="space-y-4 animate-in fade-in">
				<h3 className="text-lg font-semibold">{ t("settings.subscriptionDetails") }</h3>
				<div
					className="grid md:grid-cols-3 gap-4 p-5 rounded-xl border bg-linear-to-br from-muted/40 to-muted/20 shadow-sm">
					<div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
						<Label className="text-xs text-muted-foreground">{ t("settings.startDate") }</Label>
						<p className="text-lg font-semibold tracking-wide text-primary">
							{ formData.startDate.value ? format(new Date(formData.startDate.value), "dd/MM/yyyy") : "-" }
						</p>
					</div>

					<div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
						<Label className="text-xs text-muted-foreground">{ t("settings.endDate") }</Label>
						<p className="text-lg font-semibold tracking-wide text-primary">
							{ formData.endDate.value ? format(new Date(formData.endDate.value), "dd/MM/yyyy") : "-" }
						</p>
					</div>

					<div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
						<Label className="text-xs text-muted-foreground">{ t("settings.remainingPeriod") }</Label>
						{ formData.endDate.value
							? (() =>
							{
								const daysLeft = differenceInDays(new Date(formData.endDate.value), new Date());
								return (
									<p
										className={ `text-lg font-bold px-2 py-1 rounded-md inline-block w-fit ${
											getDaysStatusColor(daysLeft)
										} ${ getDaysBgColor(daysLeft) }` }
									>
										{ getDaysLeftText(daysLeft) }
									</p>
								);
							})()
							: "-" }
					</div>
				</div>
			</div>
		</div>
	);
}

function FieldNoticeablePing({isError, onClick}: { onClick?: () => void; isError: Signal<string | undefined>; })
{
	return (
		<span
			onClick={ onClick }
			className={ cn(
				"relative cursor-pointer flex size-3 -inset-s-[3%]",
				isError.value ? "top-[54%]" : "top-[70%]"
			) }
		>
      <span className="absolute h-full w-full animate-ping rounded-full bg-sky-400 opacity-75">
      </span>
      <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
    </span>
	);
}
