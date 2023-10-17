import { app, BrowserWindow, ipcMain, nativeImage } from "electron";
import childProcess from "child_process";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import WindowManager from "./wins/window-manager";
import { initFileOperation, getCurrentFilePath } from "./file";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

let winMgr: WindowManager | null = new WindowManager();

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    winMgr?.clean();
    winMgr = null;
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
  winMgr?.createMainWin();
});

ipcMain.on("take-screenshot", () => {
  winMgr?.createScreenshotWin();
});

ipcMain.on("show-monitor", (_event, area: [number, number, number, number]) => {
  winMgr?.createMonitorWin(area);
});

ipcMain.on("hide-monitor", () => {
  winMgr?.destroyMonitorWin();
});

let botProcess: childProcess.ChildProcess | null = null;
ipcMain.on("turn-on-bot", (_event, flowId: string) => {
  const bounds = winMgr?._monitorWin?.getBounds();
  if (!bounds) return;

  winMgr?._monitorWin?.setIgnoreMouseEvents(true, { forward: true });

  const { x, y, width, height } = bounds;
  const configFilePath = getCurrentFilePath();
  console.log(
    `python bot/main.py --config=${configFilePath} --flow=${flowId} --area=${[
      x,
      y,
      width,
      height,
    ].toString()}`
  );
  botProcess = childProcess.spawn("python", [
    "bot/main.py",
    `--config=${configFilePath}`,
    `--flow=${flowId}`,
    `--area=${[x, y, width, height].toString()}`,
  ]);

  botProcess.stdout?.on("data", function (data: Buffer) {
    console.log("stdout: ", data.toString());
  });

  botProcess.stderr?.on("data", (data: string) => {
    console.error(`stderr: ${data}`);
  });

  botProcess.on("close", (code: string) => {
    console.log(`child process exited with code ${code}`);
  });
});

ipcMain.on("turn-off-bot", (event) => {
  botProcess?.kill("SIGINT");
  botProcess = null;
  event.sender.send("turned-off");
});

ipcMain.on("detect-image", (_event, imageURL: string) => {
  const bounds = winMgr?._monitorWin?.getBounds();
  if (!bounds) return;

  const { x, y, width, height } = bounds;
  const image = nativeImage.createFromDataURL(imageURL);
  const png = image.toPNG();
  const tmpDir = os.tmpdir();
  const imageName = `${(+new Date()).toString()}.png`;
  const imagePath = path.join(tmpDir, imageName);
  fs.writeFileSync(imagePath, png);

  botProcess = childProcess.spawn("python", [
    "bot/main.py",
    `--image=${imagePath}`,
    `--area=${[x, y, width, height].toString()}`,
  ]);

  botProcess.stdout?.on("data", function (data: Buffer) {
    // Do some process here
    const areas = JSON.parse(data.toString());
    console.log("matched areas: ", areas);
    winMgr?._monitorWin?.webContents.send("detected-areas", areas);
  });

  botProcess.stderr?.on("data", (data: string) => {
    console.error(`stderr: ${data}`);
  });

  botProcess.on("close", (code: string) => {
    console.log(`child process exited with code ${code}`);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log("delete error");
      } else {
        console.log("deleted temporary image file.");
      }
    });
  });
});

initFileOperation();
