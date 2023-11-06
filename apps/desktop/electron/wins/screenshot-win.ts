import {
  BrowserWindow,
  screen,
  type Rectangle,
  type BrowserWindowConstructorOptions,
} from "electron";
import path from "path";

// TODO screen permission problem
export class ScreenshotWin {
  win: BrowserWindow

  constructor() {
    const option = initOption();
    this.win = new BrowserWindow(option)
  }
}

interface Display extends Rectangle {
  scaleFactor: number;
}

const getDisplay = (): Display => {
  const point = screen.getCursorScreenPoint();
  const { bounds, scaleFactor } = screen.getDisplayNearestPoint(point);

  // https://github.com/nashaofu/screenshots/issues/98
  return {
    x: Math.floor(bounds.x),
    y: Math.floor(bounds.y),
    width: Math.floor(bounds.width),
    height: Math.floor(bounds.height),
    scaleFactor,
  };
};

const initOption = (): BrowserWindowConstructorOptions => {
  const windowTypes: Record<string, string | undefined> = {
    darwin: "panel",
    // linux 必须设置为 undefined，否则会在部分系统上不能触发focus 事件
    // https://github.com/nashaofu/screenshots/issues/203#issuecomment-1518923486
    linux: undefined,
    win32: "toolbar",
  };
  const display = getDisplay();

  return {
    x: display.x,
    y: display.y,
    width: display.width,
    height: display.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    useContentSize: true,
    type: windowTypes[process.platform],
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    // focusable 必须设置为 true, 否则窗口不能及时响应esc按键，输入框也不能输入
    focusable: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    /**
     * linux 下必须设置为false，否则不能全屏显示在最上层
     * mac 下设置为false，否则可能会导致程序坞不恢复问题，且与 kiosk 模式冲突
     */
    fullscreen: false,
    // mac fullscreenable 设置为 true 会导致应用崩溃
    fullscreenable: false,
    kiosk: true,
    backgroundColor: "#00000000",
    titleBarStyle: "hidden",
    hasShadow: false,
    paintWhenInitiallyHidden: false,
    // mac 特有的属性
    roundedCorners: false,
    enableLargerThanScreen: false,
    acceptFirstMouse: true,
  };
};
