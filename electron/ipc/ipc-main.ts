import { ipcMain, nativeImage } from "electron";
import { winMgr, fileMgr, botMgr } from "../managers";
import * as EVENT_NAME from "./event-names";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function initIpcMain() {
  // Toggle monitor window visible state
  ipcMain.on(EVENT_NAME.TOGGLE_MONITOR_VISIBLE, (_event, region?: Region) => {
    if (region) {
      const monitorWin = winMgr.createMonitorWin(region);
      // Notice main window that the monitor window geometry was changed
      monitorWin.onChangedGeometry((geometry) => {
        winMgr.mainWin?.webContents.send(
          EVENT_NAME.CHANGED_MONITOR_WINDOW_GEOMETRY,
          geometry
        );
      });
    } else {
      winMgr.destroyMonitorWin();
    }
  });

  // Matching a given image template and showing the area on the monitor window
  ipcMain.on(EVENT_NAME.MATCH_TEMPLATE, (_event, imageURL: string) => {
    const bounds = winMgr.monitorWin?.getBounds();
    if (!bounds) return;

    const image = nativeImage.createFromDataURL(imageURL);
    const png = image.toPNG();
    const { removeFile, dir } = fileMgr.saveAsTemporaryFile(png, "png");
    const { x, y, width, height } = bounds;

    botMgr.execBotForMatchTemplate({
      imagePath: dir,
      region: { x, y, w: width, h: height },
      stdout: (data) => {
        const areas = JSON.parse(data.toString());
        console.log("matched areas: ", areas);
        winMgr?.monitorWin?.webContents.send(
          EVENT_NAME.DRAW_MATCHED_REGION,
          areas
        );
      },
      close: removeFile,
    });
  });

  // Execute auto gui bot
  ipcMain.on(EVENT_NAME.TURN_ON_BOT, (_event, flowId: string) => {
    const bounds = winMgr?.monitorWin?.getBounds();
    if (!bounds) return;
    winMgr?.monitorWin?.ignoreMouse(true);

    botMgr.execBotForAutoGui({
      flowId,
      configFilePath: fileMgr.getConfigFilePath(),
      region: { x: bounds.x, y: bounds.y, w: bounds.width, h: bounds.height },
      close: () => {
        winMgr.monitorWin?.ignoreMouse(false);
      },
    });
  });

  // Save & Load The Config File
  ipcMain.handle(EVENT_NAME.SAVE_CONFIG_FILE, (_event, contents: string) => {
    return fileMgr.saveConfigFile(contents);
  });

  ipcMain.handle(EVENT_NAME.LOAD_CONFIG_FILE, async (_event) => {
    return fileMgr.loadConfigFile();
  });
}
