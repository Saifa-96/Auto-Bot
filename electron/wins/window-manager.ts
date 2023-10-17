import { BrowserWindow } from "electron";
import path from "node:path";
import { ScreenshotWin } from "./screenshot-win";
import { MonitorWin } from "./monitor-win";
import MainWin from "./main-win";

class WindowManager {
  _mainWin: BrowserWindow | null;
  _monitorWin: BrowserWindow | null;

  constructor() {
    this._mainWin = null;
    this._monitorWin = null;
  }

  createMainWin() {
    // const win = new BrowserWindow({
    //   icon: path.join(this._publicPath, "electron-vite.svg"),
    //   webPreferences: {
    //     preload: path.join(__dirname, "preload.js"),
    //   },
    //   width: 1100,
    //   height: 700,
    // });
    const win = new MainWin().browser;
    win.on("close", () => {
      this._monitorWin?.destroy();
    });

    this.loadWin(win);

    win.webContents.openDevTools();
    this._mainWin = win;
  }

  async createScreenshotWin() {
    const win = new ScreenshotWin({
      parentWebContents: this._mainWin?.webContents!,
    });
    const result = await win.prepare();
    if (result) {
      win.establishListener();
      this.loadWin(win, "screenshot");
    }
  }

  createMonitorWin(area: [number, number, number, number]) {
    const win = new MonitorWin(this._mainWin!, area);
    // win.setIgnoreMouseEvents(true, {
    //   forward: true,
    // });
    this.loadWin(win, "monitor");
    this._monitorWin = win;
  }

  isMonitorShowing(): boolean {
    return !!this._monitorWin;
  }

  destroyMonitorWin() {
    this._monitorWin?.destroy();
    this._monitorWin = null;
  }

  loadWin(win: BrowserWindow, pathName?: string) {
    const devPath = pathName ? `#/${pathName}` : "";
    const proPath = pathName ? `index.html#/${pathName}` : "index.html";
    const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
    if (VITE_DEV_SERVER_URL) {
      console.log('vite dev server url: ', VITE_DEV_SERVER_URL + devPath)
      win.loadURL(VITE_DEV_SERVER_URL + devPath);
    } else {
      // win.loadFile('dist/index.html')
      console.log('load file path: ', process.env.VITE_PUBLIC + proPath)
      win.loadFile(path.join(process.env.VITE_PUBLIC, proPath));
    }
  }

  clean() {
    this._mainWin = null;
    this._monitorWin?.destroy();
    this._monitorWin = null;
  }
}

export default WindowManager;
