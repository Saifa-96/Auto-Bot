import path from "path";
import { app } from "electron";

export const DIST_PATH = path.join(__dirname, "../dist");

export const VITE_PUBLIC = app.isPackaged
  ? DIST_PATH
  : path.join(DIST_PATH, "../public");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

export function publicSource(fileName: string) {
  return path.join(VITE_PUBLIC, fileName);
}
