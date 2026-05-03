import type { Store } from "@reduxjs/toolkit";
import { StrictMode, type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import ErrorBoundary from "../../../error/errorBoundary";
import { ApiConstants } from "../../../networking";

interface YusrAppProps extends PropsWithChildren {
    store: Store;
    backendUrl: string;
}

export function YusrApp({ children, store, backendUrl }: YusrAppProps) {
    ApiConstants.initialize(backendUrl);

    return (
        <StrictMode>
            <Provider store={store}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </Provider>
        </StrictMode>
    );
}