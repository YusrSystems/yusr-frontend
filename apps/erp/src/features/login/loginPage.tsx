import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { YusrBackground } from "yusr-ui";
import { Services } from "@/core/services/services.ts";
import { LoginForm } from "./loginForm";
import { APP_NAME } from "../../../appConfig.ts";


export default function LoginPage()
{
	useSignals();
	const {t} = useTranslation("loginRegister");

	useEffect(() =>
	{
		document.title = `${ t("login.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	if (Services.auth.isAuthenticated)
	{
		return <Navigate to="/dashboard" replace/>;
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<YusrBackground/>
			<div className="w-full max-w-sm md:max-w-4xl">
				<LoginForm/>
			</div>
		</div>
	);
}