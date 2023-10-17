import { Conditionals } from "./base";

export interface LoopSettings {
  conditionals: Conditionals;
}

export const initLoopSettings = (): LoopSettings => {
  return {
    conditionals: [],
  };
};
