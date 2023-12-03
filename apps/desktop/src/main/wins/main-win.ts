import { shell } from "electron";
import BaseWindow from "./base-win";

class MainWin extends BaseWindow {
  constructor() {
    super("/", {
      width: 1024,
      height: 728,
      show: false,
    });

    const mainWindow = this.browserWindow;

    mainWindow.removeMenu();

    mainWindow.on("ready-to-show", () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
      }
    });

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: "deny" };
    });
  }
}

export default MainWin;
