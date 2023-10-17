import { BrowserWindow } from "electron";
import path from "node:path";

export class MonitorWin extends BrowserWindow {
  private _parent: BrowserWindow;

  constructor(parent: BrowserWindow, area: [number, number, number, number]) {
    const [x, y, w, h] = area;

    super({
      title: "Monitor",
      backgroundColor: "#00000000",
      transparent: true,
      closable: false,
      alwaysOnTop: true,
      titleBarStyle: "customButtonsOnHover",
      roundedCorners: false,
      x,
      y,
      width: w,
      height: h,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    this._parent = parent;
    this.on("resized", this.sendGeometry2Renderer);
    this.on("moved", this.sendGeometry2Renderer);
  }

  getGeometry() {
    const [x, y] = this.getPosition();
    const [w, h] = this.getSize();
    return [x, y, w, h];
  }

  sendGeometry2Renderer() {
    const area = this.getGeometry();
    const parent = this._parent;
    parent?.webContents.send("monitor-area", area);
  }
}
