import { BrowserWindow, Rectangle } from "electron";
import { MainWin, ScreenshotWin, MonitorWin } from "../wins";

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
    this.mainWin.browserWindow.on("close", () => {
      this.monitorWin?.browserWindow.destroy();
    });
    this.mainWin.browserWindow.on("closed", () => {
      this.mainWin = null;
    });
    this.mainWin.load();
    return this.mainWin;
  }

  isMainWinShowing() {
    return !!this.mainWin;
  }

  createScreenshotWin() {
    this.screenshotWin = new ScreenshotWin();
    this.screenshotWin.load();
    return this.screenshotWin;
  }

  waitWinLoad(win: BrowserWindow) {
    return new Promise((resolve) => {
      win.once("ready-to-show", () => resolve(undefined));
    });
  }

  createMonitorWin(area: Rectangle) {
    this.monitorWin = new MonitorWin(area);
    this.monitorWin.load();
    return this.monitorWin;
  }

  isMonitorShowing(): boolean {
    return !!this.monitorWin;
  }

  destroyScreenshotWin() {
    this.screenshotWin?.browserWindow.setKiosk(false);
    this.screenshotWin?.browserWindow.destroy();
    this.screenshotWin = null;
  }

  destroyMonitorWin() {
    this.monitorWin?.browserWindow.destroy();
    this.monitorWin = null;
  }

  cleanAllWins() {
    this.mainWin?.browserWindow.destroy();
    this.mainWin = null;
    this.monitorWin?.browserWindow.destroy();
    this.monitorWin = null;
    this.screenshotWin?.browserWindow.destroy();
    this.screenshotWin = null;
  }
}

export const winMgr = new WindowManager();
