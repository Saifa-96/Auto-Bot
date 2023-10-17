import { app, BrowserWindow, ipcMain } from "electron";
import { winMgr } from "./managers";
import { initIpcMain } from "./ipc/ipc-main";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

// process.env.DIST = path.join(__dirname, "../dist");
// process.env.VITE_PUBLIC = app.isPackaged
//   ? process.env.DIST
//   : path.join(process.env.DIST, "../public");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
// const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    winMgr?.cleanAllWins();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    winMgr?.createMainWin();
  }
});

app.whenReady().then(() => {
  initIpcMain();
  winMgr?.createMainWin();
});

ipcMain.on("take-screenshot", () => {
  winMgr?.createScreenshotWin();
});
