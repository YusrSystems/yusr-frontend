import { createRoot } from "react-dom/client";
import { YusrApp } from "yusr-ui";
import App from "./app.tsx";
import "./config/i18n.ts";
import { store } from "./core/state/store.ts";
import "./index.css";

function revealApp()
{
  const loader = document.getElementById("initial-loader");
  if (!loader)
  {
    return;
  }

  loader.classList.add("hiding");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });

  document.body.style.animation = "_app-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards";
}

createRoot(document.getElementById("root")!).render(
  <YusrApp
    store={ store }
    backendUrl="https://yusrerp.runasp.net/api"
    onReady={ revealApp }
  >
    <App />
  </YusrApp>
);
