/* eslint import/prefer-default-export: off */
import { URL } from "url";
import path from "path";
import { app } from "electron";

export function resolveHtmlPath(htmlFileName: string, hash?: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    if (hash) {
      url.hash = hash;
    }
    return url.href;
  }

  const route =
    hash !== "/" && hash ? htmlFileName + path.join('#', hash) : htmlFileName;
  return `file://${path.resolve(__dirname, "../renderer/", route)}`;
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export function extraResources(fileName: string) {
  return path.join(app.getAppPath(), "../extra", fileName);
}
