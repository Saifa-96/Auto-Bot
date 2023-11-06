import { systemPreferences } from "electron";
import { debugLog } from "../utils";

const checkScreenPreferences = (): boolean => {
  const status = systemPreferences.getMediaAccessStatus("screen");
  return status === "granted";
};

const checkAccessibility = (): boolean => {
  if (process.platform === "darwin") {
    const result = systemPreferences.isTrustedAccessibilityClient(true);
    debugLog("isTrustedAccessibilityClient: " + result);
    return result;
  }
  return true;
};

export const permissionsMgr = {
  checkScreenPreferences,
  checkAccessibility,
};
