import { useSignals } from "@preact/signals-react/runtime";
import { GoogleLogin } from "@react-oauth/google";


export default function SignInWithGoogle({onLogin}: { onLogin: (token: string) => Promise<void> })
{
	useSignals();
	return <div className="w-full ">
		<div className="flex content-center justify-center gap-4">

			<div>

				<GoogleLogin onSuccess={ async (res) =>
				{
					const token = res.credential;
					if (!token)
					{
						throw new Error("Token not provided");
					}
					await onLogin(token);
				} }
				             shape={ "circle" }
				             type={ "standard" }
				             auto_select={ false }
				             text={ "continue_with" }
				             size={ "large" }
				             theme={ "filled_black" }
				             width={ "100" }


				/>
			</div>
		</div>
	</div>;
}
