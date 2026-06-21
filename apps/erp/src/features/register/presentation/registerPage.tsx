import { useNavigate } from "react-router-dom";
import { YusrApiHelper, YusrBackground } from "yusr-ui";
import { RegisterForm } from "./registerForm";
import { Services } from "@/core/services/services.ts";


export default function RegisterPage()
{
	const navigate = useNavigate();

	const Logout = async () =>
	{
		const result = await YusrApiHelper.Post(`/api/Logout`);

		if (result.status === 200 || result.status === 204)
		{
			Services.auth.logout();
		}
	};

	void Logout();

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
