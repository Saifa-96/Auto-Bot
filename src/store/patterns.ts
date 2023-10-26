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
  removeImages: (indices: number[]) => void;
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
  removeImages: (indices: number[]) => {
    set((state) => {
      indices.forEach((i) => {
        state.images.splice(i, 1);
      });
    });
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
  addFlow: (name: string) => FlowData;
  updateFlow: (flow: FlowData, fn: (state: Store) => void) => void;
}

const createFlowsStore: Creator<FlowsStore> = (set, get) => ({
  flows: [],
  addFlow: (name: string) => {
    const flow = createFlow(name);
    set((state) => {
      state.flows.push(flow);
    });
    return flow;
  },
  updateFlow: (flow, fn) => {
    set((state) => {
      const index = state.flows.findIndex((f) => f.id === flow.id);
      state.flows[index] = flow;
    });

    fn?.(get());
  },
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
