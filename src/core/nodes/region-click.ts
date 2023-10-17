import { TemplateItem } from "./base";

export interface RegionClickSettings {
  region: TemplateItem;
  target: TemplateItem;
}

export function initRegionClickSettings(): RegionClickSettings {
  return { region: { imageId: null }, target: { imageId: null } };
}
