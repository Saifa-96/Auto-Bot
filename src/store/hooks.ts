import { Store } from "./patterns";
import useStore from "./create-store";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ImageData, NODE_TYPE, getImages } from "../core";
import { has } from "lodash";

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

const imageStoreSelector = (state: Store) => ({
  flows: state.flows,
  images: state.images,
  removeImages: state.removeImages
});
export const useImages = () => {
  const { flows, images, removeImages } = useStore(imageStoreSelector);
  const imageItems = useMemo(() => {
    const imageMap: { [key: string]: string[] } = {};
    const collect = (nodeId: string, imageIds: string[]) => {
      imageIds.forEach((imageId) => {
        if (!has(imageMap, imageId)) {
          imageMap[imageId] = [nodeId];
          return;
        }
        if (!imageMap[imageId].includes(nodeId)) {
          imageMap[imageId].push(nodeId);
        }
      });
    };

    flows.forEach((flow) => {
      flow.nodes.forEach((node) => {
        const imageIds = getImages[node.type as NODE_TYPE](node.data);
        collect(node.id, imageIds);
      });
    });

    return images.map((i) => ({ ...i, belong: imageMap[i.id] ?? [] }));
  }, [flows, images]);

  return { images: imageItems, removeImages }
};

const imagesSelector = (state: Store) => ({
  images: state.images,
  addImage: state.addImage,
});

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
