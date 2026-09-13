import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection, SelectField, TextAreaField } from "yusr-ui";
import type { Setting } from "@/core/data/setting.ts";
import { InvoicePrintSize } from "@/core/data/setting.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { MessageSquare, Plus } from "lucide-react";
import type { Signal } from "@preact/signals-react";
import {
	DEFAULT_WHATSAPP_QUOTATION_TEMPLATE,
	DEFAULT_WHATSAPP_SALES_TEMPLATE,
	WHATSAPP_TEMPLATE_VARIABLES
} from "@/features/commercial/logic/whatsappTemplateHelper";

const VARIABLE_LABEL_LOOKUP = new Map<string, string>(
	WHATSAPP_TEMPLATE_VARIABLES.map((v) => [v.tag, v.label])
);

/**
 * Converts raw template text (e.g. "مرحباً {{customer_name}}")
 * into HTML with non-editable atomic badge spans.
 */
function rawTextToHtml(rawText: string): string
{
	if (!rawText) return "";

	let escaped = rawText
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	escaped = escaped.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match) =>
	{
		const label = VARIABLE_LABEL_LOOKUP.get(match) || match;
		return `<span contenteditable="false" data-tag="${ match }" class="inline-flex items-center select-none cursor-default px-2 py-0.5 mx-1 rounded-md bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-300 dark:border-green-800 text-xs font-semibold align-middle">${ label }</span>\u00A0`;
	});

	return escaped.replace(/\n/g, "<br>");
}

/**
 * Converts the contenteditable DOM tree back to a clean raw template string with {{tags}}.
 */
function domToRawText(container: HTMLElement): string
{
	let result = "";

	function walk(node: Node)
	{
		if (node.nodeType === Node.TEXT_NODE)
		{
			result += node.textContent || "";
		}
		else if (node.nodeType === Node.ELEMENT_NODE)
		{
			const element = node as HTMLElement;
			if (element.hasAttribute("data-tag"))
			{
				result += element.getAttribute("data-tag") || "";
			}
			else if (element.tagName === "BR")
			{
				result += "\n";
			}
			else
			{
				const isBlock = element.tagName === "DIV" || element.tagName === "P";
				if (isBlock && result.length > 0 && !result.endsWith("\n"))
				{
					result += "\n";
				}
				for (let i = 0; i < element.childNodes.length; i++)
				{
					const child = element.childNodes[i];
					if (child) walk(child);
				}
			}
		}
	}

	for (let i = 0; i < container.childNodes.length; i++)
	{
		const child = container.childNodes[i];
		if (child) walk(child);
	}

	return result.replace(/\u00A0/g, " ");
}

interface TemplateTokenEditorProps
{
	label: string;
	valueSignal: Signal<string | undefined>;
	placeholder?: string;
}

function TemplateTokenEditor({label, valueSignal, placeholder}: TemplateTokenEditorProps)
{
	useSignals();
	const editorRef = useRef<HTMLDivElement>(null);
	const savedRangeRef = useRef<Range | null>(null);

	useEffect(() =>
	{
		const el = editorRef.current;
		if (!el) return;

		const currentRaw = domToRawText(el);
		const signalRaw = valueSignal.value || "";

		if (currentRaw !== signalRaw)
		{
			el.innerHTML = rawTextToHtml(signalRaw);
		}
	}, [valueSignal.value]);

	const saveSelection = () =>
	{
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0 && editorRef.current)
		{
			const range = sel.getRangeAt(0);
			if (editorRef.current.contains(range.commonAncestorContainer))
			{
				savedRangeRef.current = range.cloneRange();
			}
		}
	};

	const handleInput = () =>
	{
		if (!editorRef.current) return;
		const raw = domToRawText(editorRef.current);
		valueSignal.value = raw;
		saveSelection();
	};

	const insertVariable = (tag: string, tagLabel: string) =>
	{
		const el = editorRef.current;
		if (!el) return;

		el.focus();

		const badge = document.createElement("span");
		badge.setAttribute("contenteditable", "false");
		badge.setAttribute("data-tag", tag);
		badge.className = "inline-flex items-center select-none cursor-default px-2 py-0.5 mx-1 rounded-md bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-300 dark:border-green-800 text-xs font-semibold align-middle";
		badge.textContent = tagLabel;

		const spaceNode = document.createTextNode("\u00A0");

		const sel = window.getSelection();
		let range: Range | null = savedRangeRef.current;

		if (!range || !el.contains(range.commonAncestorContainer))
		{
			range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
		}

		range.deleteContents();
		range.insertNode(spaceNode);
		range.insertNode(badge);

		range.setStartAfter(spaceNode);
		range.setEndAfter(spaceNode);

		if (sel)
		{
			sel.removeAllRanges();
			sel.addRange(range);
		}

		savedRangeRef.current = range;
		handleInput();
	};

	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm font-medium text-foreground">{ label }</label>

			<div className="p-2.5 bg-muted/40 rounded-lg border text-xs text-muted-foreground space-y-2">
				<div className="flex items-center gap-1.5 font-bold text-foreground">
					<MessageSquare className="w-4 h-4 text-green-600"/>
					<span>المتغيرات المتاحة (اضغط للإضافة):</span>
				</div>
				<div className="flex flex-wrap gap-1.5 pt-0.5">
					{ WHATSAPP_TEMPLATE_VARIABLES.map((v) => (
						<button
							key={ v.tag }
							type="button"
							onMouseDown={ (e) => e.preventDefault() }
							onClick={ () => insertVariable(v.tag, v.label) }
							className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border/80 text-[11px] font-medium text-foreground hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950/40 transition-colors shadow-2xs"
						>
							<Plus className="w-3 h-3 text-muted-foreground"/>
							<span>{ v.label }</span>
						</button>
					)) }
				</div>
			</div>

			<div
				ref={ editorRef }
				contentEditable
				suppressContentEditableWarning
				dir="rtl"
				onInput={ handleInput }
				onKeyUp={ saveSelection }
				onMouseUp={ saveSelection }
				onFocus={ saveSelection }
				data-placeholder={ placeholder }
				className="min-h-[110px] max-h-[220px] overflow-y-auto w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60"
			/>
		</div>
	);
}

export default function InvoiceSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	return (
		<div className="space-y-10 animate-in fade-in">
			<FieldGroup>
				<FieldsSection title="خيارات الطباعة والسياسات" columns={ 2 }>
					<SelectField
						label={ t("settings.invoicePrintSize") }
						value={ formData.invoicePrintSize || InvoicePrintSize.A4 }
						onValueChange={ (val) =>
						{
							formData.invoicePrintSize.value = val;
						} }
						options={ [
							{
								label: t("settings.a4Paper"),
								value: InvoicePrintSize.A4
							},
							{
								label: t("settings.thermalPrinter"),
								value: InvoicePrintSize.ThermalPrinter
							}
						] }
					/>
				</FieldsSection>

				<FieldsSection columns={ 1 }>
					<TextAreaField
						label={ t("settings.salesInvoicePolicy") }
						value={ formData.saleInvoicePolicy }
						rows={ 3 }
						placeholder={ t("settings.invoicePolicyPlaceholder") }
					/>
					<TextAreaField
						label={ t("settings.quotationInvoicePolicy") }
						value={ formData.quotationInvoicePolicy }
						rows={ 3 }
						placeholder={ t("settings.invoicePolicyPlaceholder") }
					/>
				</FieldsSection>

				<FieldsSection title="قوالب رسائل الواتساب" columns={ 1 }>
					<div className="space-y-8 pt-2">
						<TemplateTokenEditor
							label="قالب رسالة فواتير المبيعات"
							valueSignal={ formData.whatsappSalesInvoiceTemplate }
							placeholder={ `مثال: ${ DEFAULT_WHATSAPP_SALES_TEMPLATE }` }
						/>

						<TemplateTokenEditor
							label="قالب رسالة عروض الأسعار"
							valueSignal={ formData.whatsappQuotationTemplate }
							placeholder={ `مثال: ${ DEFAULT_WHATSAPP_QUOTATION_TEMPLATE }` }
						/>
					</div>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}