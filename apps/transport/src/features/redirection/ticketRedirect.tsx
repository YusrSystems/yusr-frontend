import TicketReportApiService from "@/app/core/networking/reports/ticketReportApiService";
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@yusr_systems/ui";
import { AlertCircle, Loader2, LockKeyhole, Ticket } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

type RedirectStep = "input" | "loading" | "error";

export default function TicketRedirect()
{
  const { accessKey } = useParams<{ accessKey: string; }>();
  const [digits, setDigits] = useState("");
  const [step, setStep] = useState<RedirectStep>("input");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e?: React.SyntheticEvent<HTMLFormElement>) =>
  {
    if (e)
    {
      e.preventDefault();
    }
    if (digits.length !== 4)
    {
      return;
    }

    setStep("loading");
    setError(null);

    try
    {
      const response = await TicketReportApiService.getReportUrl(accessKey!, digits);

      if (response.status === 200 && response.data?.url)
      {
        window.location.replace(response.data.url);
      }
      else
      {
        setStep("input");
        setError(response.errorTitle || "الأرقام التي أدخلتها غير صحيحة، يرجى التأكد والمحاولة مرة أخرى.");
      }
    }
    catch (err)
    {
      console.error("Verification Error:", err);
      setStep("input");
      setError("حدث خطأ تقني أثناء التحقق من البيانات.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Ticket className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">بوابة تذاكر يُسْر</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 py-4">
          { step === "input" && (
            <form onSubmit={ handleVerify } className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-base text-green-600 font-bold">
                  حرصًا منا على معلوماتكم الشخصية، يرجى إثبات هويتك للوصول إلى تذكرتك
                </p>
                <p className="text-xs text-muted-foreground">أدخل آخر 4 أرقام من رقم الجوال المسجل في الحجز</p>
              </div>

              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={ 4 }
                  placeholder="****"
                  value={ digits }
                  onChange={ (e) => setDigits(e.target.value.replace(/\D/g, "")) }
                  className="text-center text-3xl font-bold tracking-[1rem] h-16 border-2 focus-visible:ring-primary"
                  autoFocus
                />
                { error && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{ error }</AlertDescription>
                    </Alert>
                  </div>
                ) }
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={ digits.length !== 4 }>
                <LockKeyhole className="ml-2 h-5 w-5" />
                عرض التذكرة
              </Button>
            </form>
          ) }

          { step === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8 animate-pulse">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200">جاري التحقق وتجهيز التذكرة...</p>
                <p className="text-sm text-muted-foreground">سيتم فتح ملف الـ PDF فور انتهاء العملية</p>
              </div>
            </div>
          ) }
        </CardContent>

        <div className="border-t pt-4 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          Yusr Bus | حافلات يُسر
        </div>
      </Card>
    </div>
  );
}
