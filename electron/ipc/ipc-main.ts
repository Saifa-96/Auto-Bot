import { Rectangle, ipcMain, nativeImage } from "electron";
import { winMgr, fileMgr, botMgr, sctMgr } from "../managers";
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
      // Notice main window that the monitor window's geometry was changed
      monitorWin.onChangedGeometry((geometry) => {
        winMgr.mainWin?.win.webContents.send(
          EVENT_NAME.CHANGED_MONITOR_WINDOW_GEOMETRY,
          geometry
        );
      });
    } else {
      winMgr.destroyMonitorWin();
    }
  });

  // Matching a given image template and showing the matched area on the monitor window
  ipcMain.on(EVENT_NAME.MATCH_TEMPLATE, (_event, imageURL: string) => {
    const bounds = winMgr.monitorWin?.win.getBounds();
    if (!bounds) return;

    const image = nativeImage.createFromDataURL(imageURL);
    const png = image.toPNG();
    const { removeFile, dir } = fileMgr.saveAsTemporaryFile(png, "png");

    botMgr.execBotForMatchTemplate({
      imagePath: dir,
      region: bounds,
      stdout: (data) => {
        const areas = JSON.parse(data.toString());
        console.log("matched areas: ", areas);
        winMgr?.monitorWin?.win.webContents.send(
          EVENT_NAME.DRAW_MATCHED_REGION,
          areas
        );
      },
      close: removeFile,
    });
  });

  // Execute auto gui bot
  ipcMain.handle(EVENT_NAME.TURN_ON_BOT, (_event, flowId: string) => {
    const bounds = winMgr?.monitorWin?.win.getBounds();
    if (!bounds) return Promise.resolve(false);

    return new Promise((resolve) => {
      winMgr.monitorWin?.ignoreMouse(true);
      botMgr.execBotForAutoGui({
        flowId,
        configFilePath: fileMgr.getConfigFilePath(),
        region: { x: bounds.x, y: bounds.y, w: bounds.width, h: bounds.height },
        close: () => {
          winMgr.monitorWin?.ignoreMouse(false);
          resolve(true);
        },
      });
    });
  });

  // Save & Load The Config File
  ipcMain.handle(EVENT_NAME.SAVE_CONFIG_FILE, (_event, contents: string) => {
    return fileMgr.saveConfigFile(contents);
  });

  ipcMain.handle(EVENT_NAME.LOAD_CONFIG_FILE, async (_event) => {
    return fileMgr.loadConfigFile();
  });

  // Take screenshot
  ipcMain.on(EVENT_NAME.TAKE_SCREENSHOT, async () => {
    // check system preferences
    const result = sctMgr.checkScreenPreferences();

    if (!result) {
      // TODO show notice to request users open screen permissions
      return null;
    }

    // load screenshot window and prepare screenshot image url
    const sctWin = winMgr.createScreenshotWin();
    const [imageURL] = await Promise.all([
      sctMgr.capture(),
      winMgr.waitWinLoad(sctWin.win),
    ]);
    sctWin.win.webContents.send(EVENT_NAME.CAPTURED_SCREENSHOT, imageURL);

    // listen crop action
    ipcMain.once(EVENT_NAME.CROP_SCREENSHOT, (_event, area: Rectangle) => {
      const croppedImageURL = sctMgr.crop(area);
      // return cropped image
      winMgr.mainWin?.win.webContents.send(
        EVENT_NAME.CROPPED_SCREENSHOT,
        croppedImageURL
      );
      winMgr.destroyScreenshotWin();
    });
  });

  // changing windows's geometry
  ipcMain.on(
    EVENT_NAME.CHANGE_GEOMETRY,
    (_event, width: number, height: number) => {
      const mainWin = winMgr.mainWin?.win;
      mainWin?.setSize(width, height);
      mainWin?.center();
    }
  );
}
