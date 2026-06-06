import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Store } from "@reduxjs/toolkit";
import { type PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import publicKeys from "../../../../publicKeys.json";
import ErrorBoundary from "../../../error/errorBoundary";
import { ApiConstants } from "../../../networking";
interface YusrAppProps extends PropsWithChildren
{
  store: Store;
  backendUrl: string;
  onReady?: () => void;
}

export function YusrApp({ children, store, backendUrl, onReady }: YusrAppProps)
{
  ApiConstants.initialize(backendUrl);

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
      <Provider store={ store }>
        <ErrorBoundary>
          { children }
        </ErrorBoundary>
      </Provider>
    </GoogleOAuthProvider>
    // </StrictMode>
  );
}
