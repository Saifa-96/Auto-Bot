import { BrowserWindow } from "electron";
import path from "node:path";

export class MonitorWin extends BrowserWindow {
  constructor(area: { x: number; y: number; w: number; h: number }) {
    const { x, y, w, h } = area;

    super({
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
    const [x, y] = this.getPosition();
    const [w, h] = this.getSize();
    return { x, y, w, h };
  }

  ignoreMouse(bool: boolean) {
    if (bool) {
      this.setIgnoreMouseEvents(true, {
        forward: true,
      });
    } else {
      this.setIgnoreMouseEvents(false);
    }
  }

  onChangedGeometry(
    callback: (geometry: { x: number; y: number; w: number; h: number }) => void
  ) {
    const fn = () => {
      const area = this.getGeometry();
      callback(area);
    };
    this.on("resized", fn);
    this.on("moved", fn);
  }
}
