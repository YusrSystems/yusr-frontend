import type { Store } from "@reduxjs/toolkit";
import { type PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import ErrorBoundary from "../../../error/errorBoundary";
import { ApiConstants } from "../../../networking";

interface YusrAppProps extends PropsWithChildren {
  store: Store;
  backendUrl: string;
  onReady?: () => void;
}

export function YusrApp({ children, store, backendUrl, onReady }: YusrAppProps) {
  ApiConstants.initialize(backendUrl);

  useEffect(() => {
    if (!onReady) {
      return;
    }
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    // <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Provider>
    // </StrictMode>
  );
}
