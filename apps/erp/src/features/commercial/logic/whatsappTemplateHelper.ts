export const WHATSAPP_TEMPLATE_TAGS = {
	CustomerName: "{{customer_name}}",
	PartnerName: "{{partner_name}}",
	DocumentNumber: "{{document_number}}",
	DocumentType: "{{document_type}}",
	TotalAmount: "{{total_amount}}",
	Currency: "{{currency}}",
	Date: "{{date}}",
	CompanyName: "{{company_name}}",
	CompanyPhone: "{{company_phone}}",
	PaidAmount: "{{paid_amount}}",
	RemainingAmount: "{{remaining_amount}}"
} as const;

export interface TemplateVariableDefinition
{
	tag: string;
	label: string;
}

export const WHATSAPP_TEMPLATE_VARIABLES: TemplateVariableDefinition[] = [
	{tag: WHATSAPP_TEMPLATE_TAGS.CustomerName, label: "اسم العميل"},
	{tag: WHATSAPP_TEMPLATE_TAGS.DocumentNumber, label: "رقم المستند"},
	{tag: WHATSAPP_TEMPLATE_TAGS.DocumentType, label: "نوع المستند"},
	{tag: WHATSAPP_TEMPLATE_TAGS.TotalAmount, label: "المبلغ الإجمالي"},
	{tag: WHATSAPP_TEMPLATE_TAGS.Currency, label: "العملة"},
	{tag: WHATSAPP_TEMPLATE_TAGS.Date, label: "التاريخ"},
	{tag: WHATSAPP_TEMPLATE_TAGS.CompanyName, label: "اسم المنشأة"},
	{tag: WHATSAPP_TEMPLATE_TAGS.CompanyPhone, label: "هاتف المنشأة"},
	{tag: WHATSAPP_TEMPLATE_TAGS.PaidAmount, label: "المبلغ المدفوع"},
	{tag: WHATSAPP_TEMPLATE_TAGS.RemainingAmount, label: "المتبقي"}
];

export const DEFAULT_WHATSAPP_SALES_TEMPLATE =
	"مرحباً {{customer_name}}، مرفق لكم {{document_type}} رقم {{document_number}} بقيمة {{total_amount}} {{currency}} الصادرة بتاريخ {{date}} من {{company_name}}.";

export const DEFAULT_WHATSAPP_QUOTATION_TEMPLATE =
	"مرحباً {{customer_name}}، يسعدنا تزويدكم بـ {{document_type}} رقم {{document_number}} بقيمة {{total_amount}} {{currency}} بتاريخ {{date}} من {{company_name}}.";

export interface WhatsappTemplateContext
{
	customerName?: string;
	documentNumber: number | string;
	documentType: string;
	totalAmount: number;
	currency?: string;
	date: string;
	companyName?: string;
	companyPhone?: string;
	paidAmount?: number;
}

/**
 * Replaces all placeholder tags in the template string with values from context.
 */
export function applyWhatsappTemplateVariables(template: string, ctx: WhatsappTemplateContext): string
{
	const formattedTotal = ctx.totalAmount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	const formattedPaid = (ctx.paidAmount || 0).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	const computedRemaining = Math.max(0, ctx.totalAmount - (ctx.paidAmount || 0));
	const formattedRemaining = computedRemaining.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	const variableReplacements: Record<string, string> = {
		[WHATSAPP_TEMPLATE_TAGS.CustomerName]: ctx.customerName || "عميلنا العزيز",
		[WHATSAPP_TEMPLATE_TAGS.PartnerName]: ctx.customerName || "عميلنا العزيز",
		[WHATSAPP_TEMPLATE_TAGS.DocumentNumber]: ctx.documentNumber.toString(),
		[WHATSAPP_TEMPLATE_TAGS.DocumentType]: ctx.documentType,
		[WHATSAPP_TEMPLATE_TAGS.TotalAmount]: formattedTotal,
		[WHATSAPP_TEMPLATE_TAGS.Currency]: ctx.currency || "ر.س",
		[WHATSAPP_TEMPLATE_TAGS.Date]: ctx.date,
		[WHATSAPP_TEMPLATE_TAGS.CompanyName]: ctx.companyName || "",
		[WHATSAPP_TEMPLATE_TAGS.CompanyPhone]: ctx.companyPhone || "",
		[WHATSAPP_TEMPLATE_TAGS.PaidAmount]: formattedPaid,
		[WHATSAPP_TEMPLATE_TAGS.RemainingAmount]: formattedRemaining
	};

	let result = template;
	for (const [tag, value] of Object.entries(variableReplacements))
	{
		result = result.replaceAll(tag, value);
	}
	return result;
}