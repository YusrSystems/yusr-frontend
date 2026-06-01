import { YusrBackground } from "yusr-ui";
import { LoginFormOld } from "./loginFormOld";

export default function LoginPage()
{
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <YusrBackground />
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginFormOld />
      </div>
    </div>
  );
}
