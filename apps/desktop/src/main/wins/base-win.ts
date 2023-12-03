import path from "path";
import {
  app,
  BrowserWindow,
  type BrowserWindowConstructorOptions,
} from "electron";
import { resolveHtmlPath } from "../utils";

class BaseWindow {
  route: string;
  browserWindow: BrowserWindow;

  constructor(route: string, options?: BrowserWindowConstructorOptions) {
    this.route = route;
    this.browserWindow = new BrowserWindow({
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, "preload.js")
          : path.join(__dirname, "../../../.erb/dll/preload.js"),
      },
      ...options,
    });
  }

  load() {
    const url = resolveHtmlPath("index.html", this.route);
    this.browserWindow.loadURL(url);
    // app.isPackaged
    //   ? this.browserWindow.loadFile(resolveHtmlPath("index.html"), {
    //       hash: this.route,
    //     })
    //   : this.browserWindow.loadURL(url);
  }
}

export default BaseWindow;
