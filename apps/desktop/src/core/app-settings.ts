import { FlowData, createFlow } from "./flow";

export interface ImageData {
  id: string;
  detail: string;
}

export interface AppSettings {
  version: string;
  flows: FlowData[];
  images: ImageData[];
  monitorArea: [number, number, number, number];
}

export function createAppSettings() {
  const flows = [createFlow()];
  return {
    version: "0.0.1",
    flows,
    images: [],
    monitorArea: [0, 0, 300, 500],
  };
}
