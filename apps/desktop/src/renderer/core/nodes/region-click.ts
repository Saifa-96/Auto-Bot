import { SettingsHandler, TemplateItem } from "./base";

export interface RegionClickSettings {
  region: TemplateItem;
  target: TemplateItem;
}

function getUsedImages(data: RegionClickSettings): string[] {
  const { region, target } = data;
  const imageIds = [];
  if (region.imageId) {
    imageIds.push(region.imageId);
  }

  if (target.imageId) {
    imageIds.push(target.imageId);
  }
  return imageIds;
}

export const RegionClickSettingsHandler: SettingsHandler<RegionClickSettings> =
  {
    new: () => ({ region: { imageId: null }, target: { imageId: null } }),
    getUsedImages,
  };
