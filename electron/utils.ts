import { DEBUG_CONSOLE } from "./ipc/event-names";
import { winMgr } from "./managers";

export const debugLog = (data: unknown) => {
  winMgr.mainWin?.win.webContents.send(DEBUG_CONSOLE, data);
};
