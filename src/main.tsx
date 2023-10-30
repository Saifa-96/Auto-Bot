import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";

window.debug.listen();

let pw = "";
const open = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    if (pw === "zxcvv") {
      window.debug.openDevTools();
      // window.removeEventListener("keydown", open);
    }
    pw = "";
    return;
  }
  pw += e.key;
};
window.addEventListener("keydown", open);

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
