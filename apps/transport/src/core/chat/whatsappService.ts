export default class WhatsappService
{
  static CreateUrl(header: string, body: string, footer: string, toPhone: string): string
  {
    let cleanPhone = toPhone.replace(/\D/g, "");

    if (cleanPhone.startsWith("05") && cleanPhone.length === 10)
    {
      cleanPhone = "966" + cleanPhone.substring(1);
    }

    const fullMessage = `*${header}*\n\n` + `${body}\n\n` + `_${footer}_`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
  }

  static SendMessage(header: string, body: string, footer: string, toPhone: string)
  {
    const url = this.CreateUrl(header, body, footer, toPhone);

    // الـ <a> Hack
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer"; // للأمان ولتجنب مشاكل الأداء

    // إخفاء العنصر تماماً
    link.style.display = "none";
    document.body.appendChild(link);

    // تنفيذ الضغط برمجياً
    link.click();

    // تنظيف DOM
    document.body.removeChild(link);
  }
}
