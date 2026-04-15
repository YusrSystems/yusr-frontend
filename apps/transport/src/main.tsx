import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApiConstants } from "@yusr_systems/core";
import { store } from './core/store.ts';
import { Provider } from "react-redux";




ApiConstants.initialize("https://yusrbus.runasp.net/api");
// ApiConstants.initialize("https://localhost:7226/api");
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
