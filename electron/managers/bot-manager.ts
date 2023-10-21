import cp from "child_process";
import { app } from "electron";
import { publicSource } from "../source-path";
import { debugLog } from "../utils";

type Process = cp.ChildProcessWithoutNullStreams | cp.ChildProcess;

class BotManager {
  private _process: Process | null;

  constructor() {
    this._process = null;
  }

  execBotForAutoGui(props: {
    flowId: string;
    configFilePath: string;
    region: { x: number; y: number; w: number; h: number };
    close?: () => void;
  }) {
    const {
      flowId,
      configFilePath,
      region: { x, y, w: width, h: height },
    } = props;

    const args = [
      `--config=${configFilePath}`,
      `--flow=${flowId}`,
      `--area=${[x, y, width, height].toString()}`,
    ];
    const process = this._execBot(args);

    process.stdout?.on("data", (data: Buffer) => {
      console.log("stdout: ", data.toString());
    });

    process.stderr?.on("data", (data: string) => {
      console.error("stderr: ", data.toString());
    });

    process.on("close", (code: string) => {
      console.log(`child process exited with code ${code}`);
      this._process = null;
    });

    return () => {
      process.kill("SIGINT");
    };
  }

  execBotForMatchTemplate(props: {
    imagePath: string;
    region: { x: number; y: number; w: number; h: number };
    stdout?: (data: Buffer) => void;
    close?: (code: string) => void;
  }) {
    const { imagePath, region, stdout, close } = props;
    const { x, y, w: width, h: height } = region;
    const args = [
      `--image=${imagePath}`,
      `--area=${[x, y, width, height].toString()}`,
    ];
    const process = this._execBot(args);

    process.stdout?.on("data", (data: Buffer) => stdout?.(data));

    process.stderr?.on("data", (data: string) => {
      debugLog(data.toString());
      console.error("stderr: ", data.toString());
    });

    process.on("close", (code: string) => {
      console.log(`child process exited with code ${code}`);
      this._process = null;
      close?.(code);
    });
  }

  private _execBot(args: string[]) {
    // this._process = app.isPackaged
    //   ? cp.execFile(publicSource('bot/bot'), args)
    //   : cp.spawn("python", ["bot/main.py", ...args]);
    debugLog('args -> ' + args)
    this._process = cp.execFile(publicSource("../bot/dist/bot/bot"), args);
    return this._process;
  }
}

export const botMgr = new BotManager();
