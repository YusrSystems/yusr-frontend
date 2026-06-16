import { useNavigate } from "react-router-dom";
import { YusrBackground } from "yusr-ui";
import { RegisterForm } from "./registerForm";


export default function RegisterPage()
{
	const navigate = useNavigate();

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
