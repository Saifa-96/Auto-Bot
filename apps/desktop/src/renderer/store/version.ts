import { useSetAtom } from "jotai";

import imagesAtom from "./images";
import monitorAreaAtom from "./monitor";
import flowsAtom from "./flows";
import { FlowData, ImageData, createFlow } from "@/core";
import { Rectangle } from "electron";

interface VersionData {
  images: ImageData[];
  monitor: Rectangle;
  flows: FlowData[];
}

export const useVersion = () => {
  const setImages = useSetAtom(imagesAtom);
  const setMonitorArea = useSetAtom(monitorAreaAtom);
  const setFlows = useSetAtom(flowsAtom);

  const init = () => {
    const flow = createFlow();
    setFlows([flow]);
    return flow;
  };

  const set = (data: VersionData) => {
    setImages(data.images);
    setMonitorArea(data.monitor);
    setFlows(data.flows);
  };

  return { init, set };
};
