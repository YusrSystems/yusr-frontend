import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './core/state/store.ts';
import { Provider } from "react-redux";
import { ApiConstants } from "../../../packages/yusr-core/src";
import ErrorBoundary from "../../../packages/yusr-ui/src/error/errorBoundary.tsx";



ApiConstants.initialize("https://yusrbus.runasp.net/api");
// ApiConstants.initialize("https://localhost:7226/api");
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)
