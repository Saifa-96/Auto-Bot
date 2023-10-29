export enum NODE_TYPE {
  START = "START",
  REGION_CLICK = "REGION_CLICK",
  MATCH_CLICK = "MATCH_CLICK",
  LOOP = "LOOP",
}

export interface TemplateItem {
  imageId: string | null;
  threshold?: number;
}

export enum CONDITIONAL_TYPE {
  IMAGE = "IMAGE",
}

export interface Conditional {
  id: string;
  name: string;
  type: CONDITIONAL_TYPE;
  targets: TemplateItem[];
}

export interface OrConditional {
  id: string;
  name: string;
  conditionals: Conditional[];
}

export type Conditionals = (Conditional | OrConditional)[];

export const isOrConditional = (
  conditional: Conditional | OrConditional
): conditional is OrConditional => {
  return "conditionals" in conditional;
};

export interface SettingsHandler<T> {
  new: () => T;
  getUsedImages(settings: T): string[];
}
