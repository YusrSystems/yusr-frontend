import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { LoadingTranslations, YusrApp } from "yusr-ui";
import App from "./app.tsx";
import { store } from "./core/state/store.ts";
import "./config/i18n.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingTranslations />}>
    <YusrApp
      store={ store }
      backendUrl="https://yusrerp.runasp.net/api"
      // backendUrl="https://localhost:7142/api"
    >
      <App />
    </YusrApp>
  </Suspense>
);
