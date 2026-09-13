import { useEffect, useMemo, useRef } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	TextAreaField,
	TextField,
	YusrApiHelper
} from "yusr-ui";
import { AlertCircle, Loader2, QrCode, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";
import { Services } from "@/core/services/services";
import { QuotationReportRequest, SalesInvoiceReportRequest } from "@/features/reports/invoice/invoiceReportRequest";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport";
import type { CommercialReportResult } from "@/features/reports/invoice/invoiceReportResult";
import {
	applyWhatsappTemplateVariables,
	DEFAULT_WHATSAPP_QUOTATION_TEMPLATE,
	DEFAULT_WHATSAPP_SALES_TEMPLATE
} from "@/features/commercial/logic/whatsappTemplateHelper";

type CommercialSendWhatsappDialogDocumentType = "sales" | "quotations";

interface CommercialSendWhatsappDialogProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	documentId: number;
	documentType: CommercialSendWhatsappDialogDocumentType;
	totalAmount: number;
	documentDate: string;
	partnerName?: string;
	partnerMobile?: string;
	partnerId?: number;
	paidAmount?: number;
	remainingAmount?: number;
}

type ConnectionState = "checking" | "disconnected" | "connecting" | "connected";

/**
 * Converts Eastern Arabic numerals (٠-٩) and Persian numerals (۰-۹) to standard Western digits (0-9)
 */
function toLatinDigits(str: string): string
{
	const easternMap: Record<string, string> = {
		"٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
		"٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
		"۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
		"۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9"
	};
	return str.replace(/[٠-٩۰-۹]/g, (digit) => easternMap[digit] || digit);
}

/**
 * Strictly normalizes and validates phone numbers.
 * Handles local Saudi numbers (05xxxxxxxx, 5xxxxxxxx) and international standards.
 */
function normalizeAndValidatePhone(rawPhone?: string): { isValid: boolean; normalized: string; errorMessage?: string }
{
	if (!rawPhone || !rawPhone.trim())
	{
		return {
			isValid: false,
			normalized: "",
			errorMessage: "يرجى إدخال رقم هاتف العميل."
		};
	}

	// 1. Convert Arabic digits to Western digits
	let cleaned = toLatinDigits(rawPhone.trim());

	// 2. Remove all non-numeric characters (spaces, dashes, parentheses, plus signs)
	cleaned = cleaned.replace(/\D/g, "");

	// 3. Remove leading international double zero (00)
	if (cleaned.startsWith("00"))
	{
		cleaned = cleaned.substring(2);
	}

	// 4. Handle Saudi Arabia normalization rules
	// Accidental zero after country code (e.g. 96605XXXXXXXX -> 9665XXXXXXXX)
	if (cleaned.startsWith("96605") && cleaned.length === 13)
	{
		cleaned = `966${ cleaned.substring(4) }`;
	}
	// Local 10-digit format (05XXXXXXXX -> 9665XXXXXXXX)
	else if (cleaned.startsWith("05") && cleaned.length === 10)
	{
		cleaned = `966${ cleaned.substring(1) }`;
	}
	// Local 9-digit format without leading zero (5XXXXXXXX -> 9665XXXXXXXX)
	else if (cleaned.startsWith("5") && cleaned.length === 9)
	{
		cleaned = `966${ cleaned }`;
	}

	// 5. Validation Check
	// Saudi numbers: Must start with 9665 and have exactly 12 digits total
	if (cleaned.startsWith("966"))
	{
		const isSaudiMobile = /^9665\d{8}$/.test(cleaned);
		if (!isSaudiMobile)
		{
			return {
				isValid: false,
				normalized: cleaned,
				errorMessage: "رقم الجوال السعودي غير صحيح. يجب أن يتكون من 9 أرقام بعد رمز الدولة (مثال: 9665xxxxxxxx أو 05xxxxxxxx)."
			};
		}
		return {isValid: true, normalized: cleaned};
	}

	// Other International numbers: Must be valid E.164 length (between 10 and 15 digits) and cannot start with 0
	const isInternational = /^[1-9]\d{9,14}$/.test(cleaned);
	if (!isInternational)
	{
		return {
			isValid: false,
			normalized: cleaned,
			errorMessage: "رقم الهاتف غير صالح. يرجى التأكد من كتابة الرمز الدولي الصحيح بدون أصفار إضافية (مثال: 9665xxxxxxxx)."
		};
	}

	return {isValid: true, normalized: cleaned};
}

/**
 * Returns Arabic file name according to document type
 */
function getArabicFileName(documentType: CommercialSendWhatsappDialogDocumentType, documentId: number): string
{
	if (documentType === "quotations")
	{
		return `عرض_سعر_${ documentId }.pdf`;
	}

	return `فاتورة_مبيعات_${ documentId }.pdf`;
}

function getDocumentTypeNameArabic(documentType: CommercialSendWhatsappDialogDocumentType): string
{
	if (documentType === "quotations")
	{
		return "عرض سعر";
	}

	return "فاتورة مبيعات";
}

export default function CommercialSendWhatsappDialog({
	open,
	onOpenChange,
	documentId,
	documentType,
	totalAmount,
	documentDate,
	partnerName,
	partnerMobile,
	paidAmount = 0,
	remainingAmount
}: CommercialSendWhatsappDialogProps)
{
	useSignals();

	const connState = useMemo(() => signal<ConnectionState>("checking"), []);
	const qrCode = useMemo(() => signal<string | null>(null), []);

	const isSending = useMemo(() => signal(false), []);
	const phoneNumber = useMemo(() => signal(""), []);
	const message = useMemo(() => signal(""), []);
	const reportData = useMemo(() => signal<CommercialReportResult | undefined>(undefined), []);
	const reportContainerRef = useRef<HTMLDivElement>(null);

	const isDesktopApp = typeof window !== "undefined" && Boolean(window.desktopAPI?.isDesktop);

	useEffect(() =>
	{
		if (!open || !isDesktopApp || !window.desktopAPI) return;

		const checkStatus = async () =>
		{
			connState.value = "checking";
			try
			{
				const status = await window.desktopAPI!.getWhatsappStatus();
				connState.value = status.isConnected ? "connected" : "disconnected";
			}
			catch
			{
				connState.value = "disconnected";
			}
		};

		void checkStatus();
	}, [open, isDesktopApp]);

	// Initialize message template with reusable variables engine and normalize customer phone
	useEffect(() =>
	{
		if (!open) return;

		const raw = partnerMobile || "";
		const parsedPhone = normalizeAndValidatePhone(raw);
		phoneNumber.value = parsedPhone.normalized || raw;

		const isQuote = documentType === "quotations";
		const configuredTemplate = isQuote
			? Services.auth.setting?.whatsappQuotationTemplate?.value
			: Services.auth.setting?.whatsappSalesInvoiceTemplate?.value;

		const fallback = isQuote
			? DEFAULT_WHATSAPP_QUOTATION_TEMPLATE
			: DEFAULT_WHATSAPP_SALES_TEMPLATE;

		const rawTemplate = (configuredTemplate && configuredTemplate.trim()) ? configuredTemplate : fallback;

		message.value = applyWhatsappTemplateVariables(rawTemplate, {
			customerName: partnerName,
			documentNumber: documentId,
			documentType: getDocumentTypeNameArabic(documentType),
			totalAmount,
			currency: Services.auth.setting?.currency?.value?.name?.value || "ر.س",
			date: documentDate,
			companyName: Services.auth.setting?.companyName.value || "",
			companyPhone: Services.auth.setting?.companyPhone.value || "",
			paidAmount
		});

	}, [open, partnerMobile, partnerName, documentId, totalAmount, documentDate, documentType, paidAmount, remainingAmount]);

	const handleConnect = async () =>
	{
		if (!window.desktopAPI) return;
		connState.value = "connecting";

		let pollingTimer: ReturnType<typeof setInterval>;

		try
		{
			await window.desktopAPI.connectWhatsapp((qr) =>
			{
				qrCode.value = qr;
			});

			pollingTimer = setInterval(async () =>
			{
				const status = await window.desktopAPI!.getWhatsappStatus();
				if (status.isConnected)
				{
					clearInterval(pollingTimer);
					connState.value = "connected";
					toast.success("تم الاتصال بالواتساب بنجاح!");
				}
			}, 2000);
		}
		catch
		{
			toast.error("حدث خطأ أثناء محاولة الاتصال بالواتساب.");
			connState.value = "disconnected";
		}

		return () =>
		{
			if (pollingTimer) clearInterval(pollingTimer);
		};
	};

	const handleSend = async () =>
	{
		const phoneResult = normalizeAndValidatePhone(phoneNumber.value);
		if (!phoneResult.isValid)
		{
			toast.error(phoneResult.errorMessage || "يرجى إدخال رقم هاتف صحيح.");
			return;
		}

		phoneNumber.value = phoneResult.normalized;

		isSending.value = true;
		try
		{
			let endpoint = "/api/Reports/SalesInvoice";
			let reqBody: unknown = new SalesInvoiceReportRequest({invoiceId: documentId});

			if (documentType === "quotations")
			{
				endpoint = "/api/Reports/Quotation";
				reqBody = new QuotationReportRequest({quotationId: documentId});
			}

			const reportRes = await YusrApiHelper.Post<CommercialReportResult>(endpoint, reqBody);
			if (!reportRes.data)
			{
				throw new Error("فشل في جلب بيانات وتصميم الفاتورة من الخادم.");
			}

			reportData.value = reportRes.data;

			await new Promise((resolve) =>
			{
				requestAnimationFrame(() =>
				{
					requestAnimationFrame(resolve);
				});
			});

			const container = reportContainerRef.current;
			if (!container || !container.innerHTML.trim())
			{
				throw new Error("فشل في تجهيز قالب الفاتورة للطباعة.");
			}

			const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
				.map((el) =>
				{
					if (el.tagName === "LINK")
					{
						const link = el as HTMLLinkElement;
						return `<link rel="stylesheet" href="${ link.href }">`;
					}
					return el.outerHTML;
				})
				.join("\n");

			const htmlContent = `
				<!DOCTYPE html>
				<html dir="${ document.documentElement.dir || "rtl" }" lang="ar">
				<head>
					<meta charset="utf-8">
					<base href="${ window.location.origin }/">
					${ styles }
					<style>
						@page { 
							size: A4 portrait; 
							margin: 0; 
						}
						html, body { 
							background-color: #ffffff !important; 
							color: #000000 !important; 
							margin: 0 !important; 
							padding: 6mm !important; 
							width: 100% !important; 
							box-sizing: border-box !important; 
							-webkit-print-color-adjust: exact !important; 
							print-color-adjust: exact !important; 
						}
						.report {
							max-width: 100% !important;
							width: 100% !important;
							box-shadow: none !important;
							border: none !important;
							padding: 0 !important;
							margin: 0 !important;
							background: transparent !important;
						}
					</style>
				</head>
				<body class="bg-white text-foreground report-print-root">
					${ container.innerHTML }
				</body>
				</html>`;

			// 5. Arabic file name based on document type
			const arabicFileName = getArabicFileName(documentType, documentId);

			// 6. Send via Electron native WhatsApp socket
			await window.desktopAPI!.sendWhatsappInvoice({
				phoneNumber: phoneResult.normalized,
				message: message.value,
				htmlContent,
				fileName: arabicFileName
			});

			toast.success("تم إرسال الفاتورة عبر الواتساب بنجاح!");
			onOpenChange(false);
		}
		catch (err: unknown)
		{
			const errorMessage = err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال.";
			toast.error(errorMessage);
		}
		finally
		{
			isSending.value = false;
			reportData.value = undefined;
		}
	};

	return (
		<>
			<Dialog open={ open } onOpenChange={ onOpenChange }>
				<DialogContent dir="rtl" className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-green-600">
							<FaWhatsapp className="w-5 h-5"/>
							{ connState.value === "connected" ? "إرسال الفاتورة عبر الواتساب" : "ربط حساب الواتساب" }
						</DialogTitle>
						<DialogDescription>
							{ connState.value === "connected"
								? "تم الاتصال بنجاح. راجع تفاصيل الرسالة ثم اضغط إرسال."
								: "يجب ربط الواتساب أولاً لتتمكن من إرسال الفواتير مباشرة." }
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						{ !isDesktopApp ? (
							<div className="flex flex-col items-center gap-4 text-center">
								<AlertCircle className="w-12 h-12 text-amber-500"/>
								<p className="text-sm leading-relaxed">
									هذه الميزة تتطلب تشغيل النظام عبر <strong>تطبيق سطح المكتب</strong>.
								</p>
							</div>
						) : connState.value === "checking" ? (
							<div className="flex justify-center p-6">
								<Loader2 className="w-8 h-8 animate-spin text-primary"/>
							</div>
						) : connState.value === "disconnected" ? (
							<div className="flex flex-col items-center gap-4 text-center p-4">
								<QrCode className="w-16 h-16 text-muted-foreground opacity-50"/>
								<p className="text-sm text-muted-foreground">
									تطبيق الواتساب غير متصل. اضغط على الزر أدناه لمسح رمز الـ QR.
								</p>
								<Button className="bg-green-600 hover:bg-green-700 text-white w-full"
								        onClick={ handleConnect }>
									توليد رمز QR للربط
								</Button>
							</div>
						) : connState.value === "connecting" ? (
							<div className="flex flex-col items-center gap-4 p-4">
								{ qrCode.value ? (
									<div className="bg-white p-2 rounded-xl border shadow-sm">
										<img
											src={ `data:image/png;base64,${ qrCode.value }` }
											alt="QR Code"
											className="w-56 h-56 object-contain"
										/>
									</div>
								) : (
									<Loader2 className="w-10 h-10 animate-spin text-primary"/>
								) }
								<p className="text-sm text-muted-foreground flex items-center gap-2">
									<Loader2 className="w-4 h-4 animate-spin"/> بانتظار المسح من هاتفك...
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								<TextField
									label="رقم هاتف العميل"
									value={ phoneNumber }
									placeholder="مثال: 9665xxxxxxxx أو 05xxxxxxxx"
									required
									disabled={ isSending.value }
								/>
								<TextAreaField
									label="نص الرسالة"
									value={ message }
									rows={ 4 }
									required
									disabled={ isSending.value }
								/>
							</div>
						) }
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" disabled={ isSending.value }>
								إلغاء
							</Button>
						</DialogClose>
						{ isDesktopApp && connState.value === "connected" && (
							<Button
								className="bg-green-600 hover:bg-green-700 text-white gap-2"
								onClick={ handleSend }
								disabled={ isSending.value }
							>
								{ isSending.value ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin"/>
										جاري التجهيز والإرسال...
									</>
								) : (
									<>
										<Send className="w-4 h-4"/>
										إرسال الآن
									</>
								) }
							</Button>
						) }
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Hidden mount for rendering exact print styling when sending */}
			<div
				ref={ reportContainerRef }
				style={ {
					position: "fixed",
					left: "-9999px",
					top: "0px",
					width: "210mm",
					minHeight: "297mm",
					visibility: "visible",
					pointerEvents: "none"
				} }
			>
				{ reportData.value && <InvoiceReport data={ reportData.value } isPortal={ false }/> }
			</div>
		</>
	);
}