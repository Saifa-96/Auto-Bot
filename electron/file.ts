import fs from "fs";
import { dialog, ipcMain } from "electron";

let currentFilePath: string | undefined;

export const getCurrentFilePath = () => currentFilePath;

export const initFileOperation = () => {
  ipcMain.on(
    "save-app-settings",
    async (event, preload: { path: string | null; contents: string }) => {
      const { path, contents } = preload;
      currentFilePath = currentFilePath ?? getSavePath();

      // cancel saving the file
      if (!currentFilePath) {
        event.sender.send("saved-app-settings", null);
        return;
      }

      const result = await saveAsJSON(currentFilePath, contents);
      if (result) {
        event.sender.send("saved-app-settings", path);
      }
    }
  );

  ipcMain.on("read-app-settings", async (event) => {
    currentFilePath = getOpenPath();
    if (!currentFilePath) {
      return;
    }
    const result = await readJSONFile(currentFilePath);
    event.sender.send("received-app-settings", result);
  });
};

const getSavePath = () => {
  const filePath = dialog.showSaveDialogSync({
    title: "Save App Settings",
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });
  return filePath;
};

const getOpenPath = () => {
  const filePath = dialog.showOpenDialogSync({
    title: "Open Project",
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });
  return filePath && filePath[0];
};

const saveAsJSON = (path: string, contents: string) => {
  return new Promise((resolve) => {
    fs.writeFile(path, contents, () => {
      resolve(true);
    });
  });
};

const readJSONFile = (path: string) => {
  return new Promise<string | null>((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject(null);
        return;
      }
      resolve(data);
    });
  });
};
