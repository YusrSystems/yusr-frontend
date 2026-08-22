import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { YusrBackground } from "yusr-ui";
import { RegisterForm } from "./registerForm";
import { APP_NAME } from "../../../../appConfig.ts";


export default function RegisterPage()
{
	const navigate = useNavigate();
	const {t} = useTranslation("loginRegister");

	useEffect(() =>
	{
		document.title = `${ t("register.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<YusrBackground/>
			<div className="w-full max-w-sm md:max-w-4xl">
				<RegisterForm
					onLoginClick={ () => navigate("/login") }
				/>
			</div>
		</div>
	);
}