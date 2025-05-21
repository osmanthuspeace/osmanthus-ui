import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
(function () {
  var tooltip = document.createElement("div");
  tooltip.style =
    "position:fixed;z-index:9999;background:#fff;padding:4px 8px;border:1px solid #ccc;border-radius:3px;font:12px/1.5 sans-serif;pointer-events:none;display:none;";
  document.body.appendChild(tooltip);

  document.addEventListener("mousemove", function (e) {
    tooltip.style.display = "block";
    tooltip.innerHTML = `X: ${e.clientX}<br>Y: ${e.clientY}`;
    tooltip.style.left = e.clientX + 10 + "px";
    tooltip.style.top = e.clientY + 15 + "px";
  });

  document.addEventListener("mouseout", function () {
    tooltip.style.display = "none";
  });

  window.addEventListener("beforeunload", function () {
    document.removeEventListener(
      "mousemove",
      arguments.callee as EventListenerOrEventListenerObject
    );
    document.removeEventListener(
      "mouseout",
      arguments.callee as EventListenerOrEventListenerObject
    );
  });
})();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
