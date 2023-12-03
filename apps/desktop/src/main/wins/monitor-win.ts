import { BrowserWindow, Rectangle } from "electron";
import path from "path";
import BaseWindow from "./base-win";

class MonitorWin extends BaseWindow {
  // win: BrowserWindow;

  constructor(area: Rectangle) {
    const { x, y, width, height } = area;
    super("/monitor", {
      title: "Monitor",
      backgroundColor: "#00000000",
      transparent: true,
      closable: false,
      alwaysOnTop: true,
      titleBarStyle: "customButtonsOnHover",
      roundedCorners: false,
      frame: false,
      x,
      y,
      width,
      height,
    });
  }

  getGeometry(): Rectangle {
    const win = this.browserWindow;
    const [x, y] = win.getPosition();
    const [w, h] = win.getSize();
    return { x, y, width: w, height: h };
  }

  ignoreMouse(bool: boolean) {
    if (bool) {
      this.browserWindow.setIgnoreMouseEvents(true, {
        forward: true,
      });
    } else {
      this.browserWindow.setIgnoreMouseEvents(false);
    }
  }

  onChangedGeometry(callback: (geometry: Rectangle) => void) {
    const fn = () => {
      const area = this.getGeometry();
      callback(area);
    };
    this.browserWindow.on("resized", fn);
    this.browserWindow.on("moved", fn);
  }
}

export default MonitorWin;
