import { Conditionals, isOrConditional } from "./base";

export interface LoopSettings {
  conditionals: Conditionals;
}

export const initLoopSettings = (): LoopSettings => {
  return {
    conditionals: [],
  };
};

export const getUsedImages = (data: LoopSettings): string[] => {
  return data.conditionals.reduce<string[]>((arr, c) => {
    if (isOrConditional(c)) {
      arr = arr.concat(getUsedImages({ conditionals: c.conditionals }));
    } else {
      const isString = (v: string | null): v is string => typeof v === "string";
      const imageIds = c.targets.map((t) => t.imageId).filter<string>(isString);
      arr = arr.concat(imageIds);
    }
    return arr;
  }, []);
};
