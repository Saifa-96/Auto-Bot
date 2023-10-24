import { BrowserWindow } from "electron";
import path from "node:path";

export class MonitorWin {
  win: BrowserWindow;

  constructor(area: { x: number; y: number; w: number; h: number }) {
    const { x, y, w, h } = area;
    this.win = new BrowserWindow({
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
      width: w,
      height: h,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        // TODO temporarily resolve 'Not allowed to load local resource: xxx' problem
        // webSecurity: false,
      },
    });
  }

  getGeometry() {
    const win = this.win
    const [x, y] = win.getPosition();
    const [w, h] = win.getSize();
    return { x, y, w, h };
  }

  ignoreMouse(bool: boolean) {
    if (bool) {
      this.win.setIgnoreMouseEvents(true, {
        forward: true,
      });
    } else {
      this.win.setIgnoreMouseEvents(false);
    }
  }

  onChangedGeometry(
    callback: (geometry: { x: number; y: number; w: number; h: number }) => void
  ) {
    const fn = () => {
      const area = this.getGeometry();
      callback(area);
    };
    this.win.on("resized", fn);
    this.win.on("moved", fn);
  }
}
