import type { EInvoicingEnvironmentType } from "@/core/data/setting";
import EInvoicingApiService from "@/core/networking/eInvoicingApiService";
import { updateSetting, useAppDispatch } from "@/core/state/store";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button, Card, CardContent, OtpInput } from "yusr-ui";

interface EInvoicingRegisterProps
{
  linkType: EInvoicingEnvironmentType;
  onFinish?: () => void;
}

export function EInvoicingRegister({ linkType, onFinish }: EInvoicingRegisterProps)
{
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLink = async () =>
  {
    if (otp.length !== 6 || loading)
    {
      return;
    }

    setLoading(true);

    let res = await new EInvoicingApiService().Link(otp, linkType);

    if (res.status === 200)
    {
      onFinish?.();
      dispatch(updateSetting({ eInvoicingEnvironmentType: linkType }));
    }

    setLoading(false);
  };

  return (
    <div dir="rtl" className="flex flex-col items-center gap-8 py-6">
      { /* Icon + heading */ }
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 dark:bg-green-950">
          <ShieldCheck className="w-7 h-7 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">ربط هيئة الزكاة والضريبة والجمارك</h2>
          <p className="text-sm text-muted-foreground mt-1">أدخل رمز التحقق المكوّن من 6 أرقام</p>
        </div>
      </div>

      { /* OTP + button */ }
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-6 pt-6">
          <OtpInput value={ otp } onChange={ setOtp } disabled={ loading } />

          <Button
            type="button"
            onClick={ handleLink }
            disabled={ otp.length !== 6 || loading }
            className="w-full rounded-xl h-11"
          >
            { loading
              ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الربط...
                </>
              )
              : "بدء الربط" }
          </Button>
        </CardContent>
      </Card>

      { /* Help */ }
      <div className="flex flex-col items-center gap-1 text-center text-sm text-muted-foreground">
        <p>لم تحصل على رمز التحقق؟</p>
        <p>زُر موقع الهيئة للحصول على رمز التحقق</p>
        <a
          href="https://login.zatca.gov.sa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline underline-offset-4 mt-1"
        >
          login.zatca.gov.sa
        </a>
      </div>
    </div>
  );
}
