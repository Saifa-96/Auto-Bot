import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import path from "path";
import { VITE_PUBLIC } from "../source-path";

export class MainWin {
  win: BrowserWindow

  constructor() {
    const options: BrowserWindowConstructorOptions = {
      icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      width: 1100,
      height: 700,
    };

    this.win = new BrowserWindow(options)
  }
}
