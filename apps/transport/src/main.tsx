import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApiConstants } from "@yusr_systems/core";
ApiConstants.initialize("https://yusrbus.runasp.net/api");
// ApiConstants.initialize("https://localhost:7226/api");
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
