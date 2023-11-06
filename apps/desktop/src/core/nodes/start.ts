import { SettingsHandler } from ".";

export interface StartSettings {}

// export function initStartSettings() {
//   return {};
// }

function getUsedImages() {
  return [];
}

export const StartSettingsHandler: SettingsHandler<StartSettings> = {
  new: () => ({}),
  getUsedImages,
};
