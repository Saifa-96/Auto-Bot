import { ipcRenderer, IpcRendererEvent, Rectangle } from "electron";

export const screenshotWindowProps = {
  takeScreenshot: () => {
    ipcRenderer.send("take-screenshot");
    return new Promise<string>((resolve) => {
      ipcRenderer.once("cropped-image", (_event, imageURL) => {
        resolve(imageURL);
      });
    });
  },
  capturedScreen: () => {
    return new Promise<{ imageURL: string }>((resolve) => {
      ipcRenderer.once("screenshot-captured", (_, item) => {
        resolve(item);
      });
    });
  },
  cropScreenshot: (area: Rectangle | null) => {
    ipcRenderer.send("crop-screenshot", area);
  },
  turnOnBot: (flowId: string) => {
    ipcRenderer.send("turn-on-bot", flowId);
  },
  turnOffBot: () => {
    ipcRenderer.send("turn-off-bot");
  },
  saveAppSettings: (preload: { path: null; contents: string }) => {
    return new Promise<string | null>((resolve) => {
      ipcRenderer.send("save-app-settings", preload);
      ipcRenderer.once("saved-app-settings", (_event, path: string | null) => {
        resolve(path);
      });
    });
  },
  readAppSettings: () => {
    return new Promise<string>((resolve) => {
      ipcRenderer.send("read-app-settings");
      ipcRenderer.once("received-app-settings", (_event, result) => {
        resolve(result);
      });
    });
  },

  showMonitor: (area: [number, number, number, number]) => {
    ipcRenderer.send("show-monitor", area);
  },
  hideMonitor: () => {
    ipcRenderer.send("hide-monitor");
  },
  monitorArea: (fn: (area: [number, number, number, number]) => void) => {
    const callback = (
      _event: IpcRendererEvent,
      area: [number, number, number, number]
    ) => {
      fn(area);
    };

    ipcRenderer.on("monitor-area", callback);

    return () => ipcRenderer.off("monitor-area", callback);
  },
  detectImage(imageURL: string) {
    ipcRenderer.send("detect-image", imageURL);
  },
  detectedAreas(callback: (areas: [number, number, number, number][]) => void) {
    const listener = (
      _event: IpcRendererEvent,
      areas: [number, number, number, number][]
    ) => {
      console.log("listener area", areas);
      callback(areas);
    };
    ipcRenderer.on("detected-areas", listener);
    return () => ipcRenderer.off("detected-areas", listener);
  },
};
