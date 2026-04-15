
import { toast } from "sonner";
import TicketReportApiService from "../../../core/networking/reports/ticketReportApiService";
import { useAppSelector } from "../../../core/state/store";
import type { Ticket } from "../data/ticket";
import WhatsappService from "../../../core/chat/whatsappService";

export type useBusSeatProps = { ticket?: Ticket; isOccupied: boolean; onCheckInUpdate?: (ticketId: number) => void; };
export default function useBusSeat({ ticket, isOccupied, onCheckInUpdate }: useBusSeatProps)
{
  const authState = useAppSelector((state) => state.auth);

  const handleContextMenuAction = (e: React.MouseEvent) =>
  {
    if (!isOccupied)
    {
      e.preventDefault();
    }
  };

  const handlePrintTicket = async (checkIn: boolean) =>
  {
    if (ticket?.id == undefined)
    {
      toast.error("لم يتم حفظ التغييرات بعد");
      return;
    }

    const result = await TicketReportApiService.getReport(ticket.id, checkIn);

    if (result && checkIn)
    {
      onCheckInUpdate?.(ticket?.id);
      toast.success("تم التحضير والطباعة بنجاح");
    }
  };

  const handleShareTicket = async (checkIn: boolean) =>
  {
    if (ticket?.id == undefined)
    {
      toast.error("لم يتم حفظ التغييرات بعد");
      return;
    }

    await TicketReportApiService.getReport(ticket.id, checkIn, "share", `ticket_${ticket.id}`);

    if (checkIn)
    {
      onCheckInUpdate?.(ticket?.id);
    }
  };

  const handleSendByWhatsappTicket = async () =>
  {
    if (!ticket?.id || !ticket?.accessKey)
    {
      toast.error("لم يتم حفظ التغييرات بعد أو بيانات التذكرة غير مكتملة");
      return;
    }
    if (!ticket?.passenger?.phoneNumber)
    {
      toast.error("المسافر ليس لديه رقم جوال مسجل");
      return;
    }

    try
    {
      const loadingToast = toast.loading("جاري تجهيز رابط التذكرة...");
      const last4 = ticket.passenger.phoneNumber.slice(-4);
      const response = await TicketReportApiService.addToStorage(ticket.accessKey, last4);

      if (response.status === 200)
      {
        toast.success("تم تجهيز الرابط بنجاح، جاري فتح واتساب...", { id: loadingToast });
        const shortUrl = `${window.location.origin}/t/${ticket.accessKey}`;
        const header = `تأكيد حجز - ${authState.setting?.companyName}`;
        const body = `عزيزي المسافر، تم تأكيد حجزك بنجاح.\n`
          + `رقم التذكرة: ${ticket.id}\n`
          + `يمكنك تحميل التذكرة من الرابط التالي:\n\n${shortUrl}`;
        const footer = `شكراً لاختياركم ${authState.setting?.companyName}، رحلة سعيدة!`;

        WhatsappService.SendMessage(header, body, footer, ticket.passenger.phoneNumber);

        toast.dismiss(loadingToast);
      }
      else
      {
        toast.error("فشل في تجهيز الرابط، يرجى المحاولة مرة أخرى");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error)
    {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  const handleSendByEmailTicket = async () =>
  {
    if (!ticket?.id || !ticket?.accessKey)
    {
      toast.error("لم يتم حفظ التغييرات بعد أو بيانات التذكرة غير مكتملة");
      return;
    }
    if (!ticket?.passenger?.phoneNumber)
    {
      toast.error("المسافر ليس لديه رقم جوال مسجل");
      return;
    }
    if (!ticket?.passenger?.email)
    {
      toast.error("المسافر ليس لديه بريد إلكتروني مسجل");
      return;
    }

    const loadingToast = toast.loading("جاري إرسال التذكرة إلى البريد الإلكتروني...");

    try
    {
      const last4 = ticket.passenger.phoneNumber.slice(-4);
      const response = await TicketReportApiService.sendByEmail(ticket.accessKey, last4);

      if (response.status === 200)
      {
        toast.success(response.data?.title || "تم إرسال التذكرة بنجاح!", {
          id: loadingToast,
          description: `تم إرسال ملف PDF إلى ${ticket.passenger.email}`
        });
        toast.dismiss(loadingToast);
      }
      else
      {
        toast.dismiss(loadingToast);
      }
    }
    catch (error)
    {
      console.error("Email Error:", error);
      toast.error("حدث خطأ غير متوقع أثناء محاولة الإرسال", { id: loadingToast });
    }
  };

  return {
    authState,
    handleContextMenuAction,
    handlePrintTicket,
    handleShareTicket,
    handleSendByWhatsappTicket,
    handleSendByEmailTicket
  };
}
