import { dialog, app } from "electron";
import fs from "node:fs";
import path from "node:path";

class FileManager {
  private _configFilePath?: string;

  getConfigFilePath() {
    return this._configFilePath!;
  }

  saveConfigFile(contents: string) {
    const savePath = this._configFilePath ?? requestSavePath();
    if (!savePath) {
      // cancel save
      return;
    }

    this._configFilePath = savePath;
    return write(savePath, contents);
  }

  loadConfigFile() {
    const loadPath = requestOpenPath();
    if (!loadPath) {
      // cancel load
      return;
    }
    this._configFilePath = loadPath;
    return read(loadPath);
  }

  saveAsTemporaryFile(data: string | NodeJS.ArrayBufferView, suffix: string) {
    const tempDir = app.getPath("temp");
    const fileName = `${(+new Date()).toString()}.${suffix}`;
    const dir = path.join(tempDir, fileName);
    fs.writeFileSync(dir, data);
    return {
      removeFile: () =>
        fs.unlink(dir, (err) => {
          if (err) {
            console.log("delete error");
          } else {
            console.log("deleted temporary file.");
          }
        }),
      dir,
    };
  }
}

function requestSavePath() {
  const filePath = dialog.showSaveDialogSync({
    title: "Save App Settings",
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });
  return filePath;
}

function requestOpenPath() {
  const filePath = dialog.showOpenDialogSync({
    title: "Open Project",
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });
  return filePath && filePath[0];
}

function read(path: string) {
  return new Promise<string | null>((resolve) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        resolve(null);
      } else {
        resolve(data);
      }
    });
  });
}

function write(path: string, contents: string) {
  return new Promise<boolean>((resolve) => {
    fs.writeFile(path, contents, (err) => {
      if (err) {
        console.error(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export const fileMgr = new FileManager();
