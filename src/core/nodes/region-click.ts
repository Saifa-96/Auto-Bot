import { TemplateItem } from "./base";

export interface RegionClickSettings {
  region: TemplateItem;
  target: TemplateItem;
}

export function initRegionClickSettings(): RegionClickSettings {
  return { region: { imageId: null }, target: { imageId: null } };
}

export function getUsedImages(data: RegionClickSettings): string[] {
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
