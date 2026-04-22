import { createRoot } from "react-dom/client";
import { YusrApp } from "yusr-ui";
import App from "./app.tsx";
import { store } from "./core/state/store.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <YusrApp
    store={ store }
    // backendUrl="https://yusrerp.runasp.net/api"
    backendUrl="https://localhost:7142/api"
  >
    <App />
  </YusrApp>
);
