import { YusrApiHelper, YusrBackground } from "yusr-ui";
import { LoginForm } from "./loginForm";
import { Services } from "@/core/services/services.ts";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../../appConfig.ts";


export default function LoginPage()
{
	const {t} = useTranslation("loginRegister");

	useEffect(() =>
	{
		(async () =>
		{
			const result = await YusrApiHelper.Post(`/api/Logout`);
			if (result.status === 200 || result.status === 204)
			{
				Services.auth.logout();
			}
		})();
	}, []);

	useEffect(() =>
	{
		document.title = `${ t("login.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<YusrBackground/>
			<div className="w-full max-w-sm md:max-w-4xl">
				<LoginForm/>
			</div>
		</div>
	);
}
