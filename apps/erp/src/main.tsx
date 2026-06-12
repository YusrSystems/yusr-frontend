import { createRoot } from "react-dom/client";
import { i18n, YusrApp } from "yusr-ui";
import App from "./app/app.tsx";
import { store } from "./core/state/store.ts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";

function revealApp()
{
  i18n.init();
  const loader = document.getElementById("initial-loader");

  if (!loader)
  {
    return;
  }

  loader.classList.add("hiding");
  loader.addEventListener("transitionend", () =>
  {
    loader.remove();

    // Animate all children of root except the background
    document.querySelectorAll("#root > * > *:not([data-background])").forEach((el) =>
    {
      (el as HTMLElement).style.animation = "content-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both";
    });
  }, { once: true });
}

createRoot(document.getElementById("root")!).render(
  <YusrApp
    store={ store }
    backendUrl="/api"
    onReady={ revealApp }
  >
    <App />
    <Analytics />
    <SpeedInsights />
  </YusrApp>
);
