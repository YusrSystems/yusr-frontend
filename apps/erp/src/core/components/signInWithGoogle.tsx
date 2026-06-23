import { useSignals } from "@preact/signals-react/runtime";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";


export default function SignInWithGoogle({onLogin}: { onLogin: (token: string) => Promise<void> })
{
	useSignals();

	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number>();

	useEffect(() =>
	{
		const el = containerRef.current;
		if (!el)
		{
			return;
		}

		const observer = new ResizeObserver(([entry]) =>
		{
			if (entry)
			{
				setWidth(Math.floor(entry.contentRect.width));
			}
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ containerRef }
			className="w-full h-9 overflow-hidden rounded-md flex items-center justify-center"
		>
			{ width !== undefined && (
				<GoogleLogin
					onSuccess={ async (res) =>
					{
						const token = res.credential;
						if (!token)
						{
							throw new Error("Token not provided");
						}
						await onLogin(token);
					} }
					shape={ "rectangular" }
					type={ "standard" }
					auto_select={ false }
					text={ "continue_with" }
					size={ "medium" }
					theme={ "filled_black" }
					width={ width }
				/>
			) }
		</div>
	);
}