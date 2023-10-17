import { BrowserWindow } from "electron";
import path from "node:path";
import { MainWin, ScreenshotWin, MonitorWin } from "../wins";

function loadWin(win: BrowserWindow, pathName?: string) {
  const devPath = pathName ? `#/${pathName}` : "";
  const proPath = pathName ? `index.html#/${pathName}` : "index.html";

  const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
  if (VITE_DEV_SERVER_URL) {
    console.log("vite dev server url: ", VITE_DEV_SERVER_URL + devPath);
    win.loadURL(VITE_DEV_SERVER_URL + devPath);
  } else {
    // win.loadFile('dist/index.html')
    console.log("load file path: ", process.env.VITE_PUBLIC + proPath);
    win.loadFile(path.join(process.env.VITE_PUBLIC, proPath));
  }
}

class WindowManager {
  mainWin: MainWin | null;
  screenshotWin: ScreenshotWin | null;
  monitorWin: MonitorWin | null;

  constructor() {
    this.mainWin = null;
    this.monitorWin = null;
    this.screenshotWin = null;
  }

  createMainWin() {
    this.mainWin = new MainWin();
    this.mainWin.on("close", () => {
      this.monitorWin?.destroy();
    });

    loadWin(this.mainWin);

    this.mainWin.webContents.openDevTools();
    return this.mainWin;
  }

  async createScreenshotWin() {
    this.screenshotWin = new ScreenshotWin({
      parentWebContents: this.mainWin?.webContents!,
    });
    const result = await this.screenshotWin.prepare();
    if (result) {
      this.screenshotWin.establishListener();
      loadWin(this.screenshotWin, "screenshot");
    }
    return this.screenshotWin;
  }

  createMonitorWin(area: { x: number; y: number; w: number; h: number }) {
    this.monitorWin = new MonitorWin(area);
    loadWin(this.monitorWin, "monitor");
    return this.monitorWin;
  }

  isMonitorShowing(): boolean {
    return !!this.monitorWin;
  }

  destroyMonitorWin() {
    this.monitorWin?.destroy();
    this.monitorWin = null;
  }

  cleanAllWins() {
    this.mainWin?.destroy();
    this.mainWin = null;
    this.monitorWin?.destroy();
    this.monitorWin = null;
    this.screenshotWin?.destroy();
    this.screenshotWin = null;
  }
}

export const winMgr = new WindowManager();
