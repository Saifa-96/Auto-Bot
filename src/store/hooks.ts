import { Store } from "./patterns";
import useStore from "./create-store";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ImageData } from "../core";

const flowSelector = (state: Store) => ({
  flows: state.flows,
  updateFlow: state.updateFlow,
});
export const useFlow = (flowId: string) => {
  const { flows, updateFlow } = useStore(flowSelector);

  const flow = useMemo(() => {
    return flows.find((f) => f.id === flowId);
  }, [flows, flowId]);

  if (!flow) {
    throw new Error("The flow isn't exist. Please, check the flow id.");
  }

  return { flow, updateFlow };
};

const addFlowSelector = (state: Store) => ({ addFlow: state.addFlow });
export const useAddFlow = () => useStore(addFlowSelector);

const flowListSelector = (state: Store) => {
  return state.flows.map((f) => ({ name: f.name, id: f.id }));
};
export const useFlowList = () => useStore(useShallow(flowListSelector));

const versionSelector = (state: Store) => ({
  version: state.version,
  set: state.setAppStore,
  init: state.initAppStore,
});
export const useVersion = () => useStore(versionSelector);

const monitorSelector = (state: Store) => state.updateMonitor;
export const useUpdateMonitor = () => useStore(monitorSelector);

const monitorAreaSelector = (state: Store) => state.monitor;
export const useMonitRegion = () => useStore(monitorAreaSelector);

const imagesSelector = (state: Store) => ({
  images: state.images,
  addImage: state.addImage,
});

export const useImages = () => useStore(imagesSelector);

export function useImageURL(imageId: string | null): {
  imageURL: string;
  addImage: (url: string) => ImageData;
};
export function useImageURL(imageId: (string | null)[]): {
  imageURL: string[];
  addImage: (url: string) => ImageData;
};
export function useImageURL(imageId: string | null | (string | null)[]) {
  const { images, addImage } = useStore(imagesSelector);
  const imageURL = useMemo(() => {
    if (!imageId) {
      return "";
    }
    if (Array.isArray(imageId)) {
      return imageId.map((id) => images.find((i) => i.id === id)?.detail);
    }
    const imageItem = images.find((i) => i.id === imageId);
    return imageItem?.detail;
  }, [imageId]);

  return { imageURL, addImage };
}

export function useAddImage() {
  return useStore((state) => state.addImage);
}
