import ErrorBoundary from "../../../error/errorBoundary";
import { StrictMode, type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { ApiConstants } from "yusr-core";

export function YusrApp({ children, store = null, backendUrl = undefined }: PropsWithChildren & { store?: any, backendUrl?: string }) {
    if (backendUrl)
        ApiConstants.initialize("https://yusrbus.runasp.net/api");

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