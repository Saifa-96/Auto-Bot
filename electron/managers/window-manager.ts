import { BrowserWindow } from "electron";
import { MainWin, ScreenshotWin, MonitorWin } from "../wins";
import { VITE_DEV_SERVER_URL, publicSource } from "../source-path";

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

  createScreenshotWin() {
    this.screenshotWin = new ScreenshotWin();
    loadWin(this.screenshotWin, "screenshot");
    return this.screenshotWin;
  }

  waitWinLoad(win: BrowserWindow) {
    return new Promise((resolve) => {
      win.once("ready-to-show", () => resolve(undefined));
    });
  }

  createMonitorWin(area: { x: number; y: number; w: number; h: number }) {
    this.monitorWin = new MonitorWin(area);
    loadWin(this.monitorWin, "monitor");
    return this.monitorWin;
  }

  isMonitorShowing(): boolean {
    return !!this.monitorWin;
  }

  destroyScreenshotWin() {
    this.screenshotWin?.setKiosk(false);
    this.screenshotWin?.destroy();
    this.screenshotWin = null;
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

function loadWin(win: BrowserWindow, pathName?: string) {
  const devPath = pathName ? `#/${pathName}` : "";
  const proPath = pathName ? `index.html#/${pathName}` : "index.html";

  if (VITE_DEV_SERVER_URL) {
    console.log("vite dev server url: ", VITE_DEV_SERVER_URL + devPath);
    win.loadURL(VITE_DEV_SERVER_URL + devPath);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(publicSource(proPath));
  }
}

export const winMgr = new WindowManager();
