import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import path from "node:path";
import { VITE_PUBLIC } from "../path";

interface WindowInstance {
  browser: BrowserWindow;
}

const windowConfig: BrowserWindowConstructorOptions = {
  icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
  },
  width: 1100,
  height: 700,
};

class MainWin implements WindowInstance {
  browser: BrowserWindow;

  constructor() {
    this.browser = new BrowserWindow(windowConfig);
  }
}

export default MainWin;
