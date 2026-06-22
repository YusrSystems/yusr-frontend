import { useSignals } from "@preact/signals-react/runtime";
import { GoogleLogin } from "@react-oauth/google";


export default function SignInWithGoogle({onLogin}: { onLogin: (token: string) => Promise<void> })
{
	useSignals();
	return <div className="w-full flex content-center justify-center">
		<GoogleLogin onSuccess={ async (res) =>
		{
			const token = res.credential;
			if (!token)
			{
				throw new Error("Token not provided");
			}
			await onLogin(token);
		} }/>
	</div>;
}
