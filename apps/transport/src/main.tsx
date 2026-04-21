import { createRoot } from "react-dom/client";
import App from "./app/app.tsx";
import { store } from "./app/core/state/store.ts";
import { YusrApp } from "yusr-ui";

createRoot(document.getElementById("root")!).render(
  <YusrApp store={store} backendUrl="https://yusrbus.runasp.net/api" >
    <App />
  </YusrApp>
);
