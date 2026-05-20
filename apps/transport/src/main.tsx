import { createRoot } from "react-dom/client";
import { YusrApp } from "yusr-ui";
import App from "./app/app.tsx";
import { store } from "./app/core/state/store.ts";
import "./config/i18n.ts";
import "./index.css";
function revealApp()
{
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
    backendUrl="https://yusrbus.runasp.net/api"
    // backendUrl="https://localhost:7142/api"
    onReady={ revealApp }
  >
    <App />
  </YusrApp>
);
