import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent } from "yusr-ui";

export default function Welcome()
{
  const navigate = useNavigate();

  return (
    <Card className="w-100 max-w-100">
      <CardContent>
        { /* Left: welcome content */ }
        <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
          { /* Animated checkmark circle */ }
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-green-600/20"
            style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10 ring-4 ring-green-600/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={ 2.5 }
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          { /* Text */ }
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              أهلاً بك في <span className="text-primary">يُسْر</span>
            </h2>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              تم إنشاء حسابك بنجاح. كل شيء جاهز.
            </p>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-3">
            <Button onClick={ () => navigate("/login") } className="w-full" size="lg">
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
