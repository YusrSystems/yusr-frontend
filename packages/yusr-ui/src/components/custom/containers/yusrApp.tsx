import { GoogleOAuthProvider } from "@react-oauth/google";
import { type PropsWithChildren, useEffect } from "react";
import publicKeys from "../../../../publicKeys.json";
import ErrorBoundary from "../../../error/errorBoundary";


interface YusrAppProps extends PropsWithChildren
{
	onReady?: () => void;
}

export function YusrApp({children, onReady}: YusrAppProps)
{
	useEffect(() =>
	{
		if (!onReady)
		{
			return;
		}
		const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
		return () => cancelAnimationFrame(id);
	}, []);

	return (
		// <StrictMode>
		<GoogleOAuthProvider clientId={ publicKeys.Google.ClientId }>
			<ErrorBoundary>
				{ children }
			</ErrorBoundary>
		</GoogleOAuthProvider>
		// </StrictMode>
	);
}
