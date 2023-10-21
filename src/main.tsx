import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";

window.debug.listen();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme hasBackground={false}>
      <App />
    </Theme>
  </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
