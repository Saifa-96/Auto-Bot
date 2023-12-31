import { ipcRenderer, type IpcRendererEvent, type Rectangle } from "electron";
import * as EVENT_NAME from "./event-names";

export const ipcRendererContext = {
  geometry: {
    resize: (w: number, h: number) => {
      ipcRenderer.send(EVENT_NAME.CHANGE_GEOMETRY, w, h);
    },
  },
  debug: {
    listen: () => {
      const log = (_event: IpcRendererEvent, data: unknown) => {
        console.log("ipc-main debug console:\n", data);
      };
      ipcRenderer.on(EVENT_NAME.DEBUG_CONSOLE, log);
      return () => ipcRenderer.off(EVENT_NAME.DEBUG_CONSOLE, log);
    },
    openDevTools: () => {
      ipcRenderer.send(EVENT_NAME.OPEN_DEV_MODE);
    },
  },
  screenshot: {
    takeScreenshot() {
      ipcRenderer.send(EVENT_NAME.TAKE_SCREENSHOT);
      return new Promise<string>((resolve) => {
        ipcRenderer.once(EVENT_NAME.CROPPED_SCREENSHOT, (_event, imageURL) => {
          resolve(imageURL);
        });
      });
    },
    capturedScreen() {
      return new Promise<{ imageURL: string }>((resolve) => {
        ipcRenderer.once(EVENT_NAME.CAPTURED_SCREENSHOT, (_, imageURL) => {
          resolve(imageURL);
        });
      });
    },
    cropScreenshot: (area: Rectangle | null) => {
      ipcRenderer.send(EVENT_NAME.CROP_SCREENSHOT, area);
    },
  },
  monitor: {
    isShow() {
      return ipcRenderer.invoke(EVENT_NAME.CHECK_MONITOR_SHOW);
    },
    open(area: Rectangle) {
      ipcRenderer.send(EVENT_NAME.TOGGLE_MONITOR_VISIBLE, area);
    },
    close() {
      ipcRenderer.send(EVENT_NAME.TOGGLE_MONITOR_VISIBLE);
    },
    matchTemplate(imageURL: string) {
      ipcRenderer.send(EVENT_NAME.MATCH_TEMPLATE, imageURL);
    },
    drawMatchedRegion(
      callback: (areas: [number, number, number, number][]) => void,
    ) {
      const listener = (
        _event: IpcRendererEvent,
        areas: [number, number, number, number][],
      ) => callback(areas);

      ipcRenderer.on(EVENT_NAME.DRAW_MATCHED_REGION, listener);
      return () => ipcRenderer.off(EVENT_NAME.DRAW_MATCHED_REGION, listener);
    },
    onChangedGeometry(callback: (geometry: Rectangle) => void) {
      const listener = (_event: IpcRendererEvent, geometry: Rectangle) =>
        callback(geometry);

      ipcRenderer.on(EVENT_NAME.CHANGED_MONITOR_WINDOW_GEOMETRY, listener);
      return () =>
        ipcRenderer.off(EVENT_NAME.CHANGED_MONITOR_WINDOW_GEOMETRY, listener);
    },
  },
  bot: {
    turnOn(flowId: string) {
      return ipcRenderer.invoke(EVENT_NAME.TURN_ON_BOT, flowId);
    },
  },
  configFile: {
    async save(contents: string) {
      const result = await ipcRenderer.invoke(
        EVENT_NAME.SAVE_CONFIG_FILE,
        contents,
      );
      return result;
    },
    async load() {
      const result = await ipcRenderer.invoke(EVENT_NAME.LOAD_CONFIG_FILE);
      return result;
    },
  },
};
