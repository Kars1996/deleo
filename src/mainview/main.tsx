import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// @ts-ignore css import error
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="rounded-xl bg-[var(--bg)] overflow-hidden">
      <App />
    </div>
  </StrictMode>,
);
