import { TemplateItem } from "./base";

export interface MatchClickSettings {
  targets: TemplateItem[];
}

export const initMatchClickSettings = (): MatchClickSettings => {
  return {
    targets: [],
  };
};
