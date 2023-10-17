import { StateCreator } from "zustand";
import { v4 as uuid } from "uuid";
import { type FlowData, createFlow } from "../core";

export type Store = ImageStore & MonitorStore & FlowsStore & VersionStore;

type Creator<T> = StateCreator<
  Store,
  [["zustand/persist", unknown], ["zustand/immer", never]],
  [],
  T
>;

// ========== Image Store ==========
interface ImageData {
  id: string;
  detail: string;
}

interface ImageStore {
  images: ImageData[];
  addImage: (imageURL: string) => ImageData;
}

const createImageStore: Creator<ImageStore> = (set) => ({
  images: [],
  addImage: (imageURL: string) => {
    const data = { id: uuid(), detail: imageURL };
    set((state) => {
      state.images.push(data);
    });
    return data;
  },
});
// ================================

// ========== Monitor Region ==========
interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MonitorStore {
  monitor: Region;
  updateMonitor: (r: Region) => void;
}

const createMonitorStore: Creator<MonitorStore> = (set) => ({
  monitor: { x: 0, y: 0, w: 100, h: 200 },
  updateMonitor: (r: Region) =>
    set((state) => {
      state.monitor = r;
    }),
});
// ===================================

// ========== Flows Store ==========
interface FlowsStore {
  flows: FlowData[];
  addFlow: () => void;
  updateFlow: (flow: FlowData, fn: (state: Store) => void) => void;
}

const createFlowsStore: Creator<FlowsStore> = (set, get) => ({
  flows: [],
  addFlow: () =>
    set((state) => {
      state.flows.push(createFlow());
    }),
  updateFlow: (flow, fn) =>
    set((state) => {
      const index = state.flows.findIndex((f) => f.id === flow.id);
      state.flows[index] = flow;
      fn?.(get());
    }),
});
// =================================

// ========== Version ===========
interface VersionStore {
  version: string;
  setAppStore: (state: Partial<Store>) => void;
  initAppStore: () => string;
}

const createVersionStore: Creator<VersionStore> = (set) => ({
  version: "0.0.1",
  setAppStore: (state) => set({ ...state }),
  initAppStore: () => {
    const flow = createFlow();
    set({
      version: "0.0.1",
      monitor: { x: 0, y: 0, w: 100, h: 200 },
      flows: [flow],
      images: [],
    });
    return flow.id;
  },
});
// ==============================

export const createStore: Creator<Store> = (...args) => ({
  ...createImageStore(...args),
  ...createMonitorStore(...args),
  ...createFlowsStore(...args),
  ...createVersionStore(...args),
});
