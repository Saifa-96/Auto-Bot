import { dialog } from "electron";
import fs from "fs";

class FileManager {
  private _savePath?: string;

  save(contents: string) {
    const savePath = this._savePath ?? requestSavePath();
    if (!savePath) {
      // cancel save
      return;
    }

    this._savePath = savePath;
    return write(savePath, contents);
  }

  load() {
    const loadPath = requestOpenPath();
    if (!loadPath) {
      // cancel load
      return;
    }
    this._savePath = loadPath;
    return read(loadPath);
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
