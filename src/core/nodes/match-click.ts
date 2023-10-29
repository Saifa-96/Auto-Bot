import { TemplateItem, SettingsHandler } from "./base";

export interface MatchClickSettings {
  targets: TemplateItem[];
}

// export const initMatchClickSettings = (): MatchClickSettings => {
//   return {
//     targets: [],
//   };
// };

const getUsedImages = (data: MatchClickSettings): string[] => {
  return data.targets.filter((t) => !!t.imageId).map((t) => t.imageId!);
};

export const MatchClickSettingsHandler: SettingsHandler<MatchClickSettings> = {
  new: () => ({ targets: [] }),
  getUsedImages,
};
