import { TemplateItem } from "./base";

export interface MatchClickSettings {
  targets: TemplateItem[];
}

export const initMatchClickSettings = (): MatchClickSettings => {
  return {
    targets: [],
  };
};

export const getUsedImages = (data: MatchClickSettings): string[] => {
  return data.targets.filter((t) => !!t.imageId).map((t) => t.imageId!);
};
