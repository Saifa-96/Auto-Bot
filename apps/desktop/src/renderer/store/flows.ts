import { useMemo } from "react";
import { atom, useAtom } from "jotai";
import { FlowData, createFlow } from "@/core";

const flowsAtom = atom<FlowData[]>([]);
export default flowsAtom;

export const useFlow = (flowId: string) => {
  const [flows, setFlows] = useAtom(flowsAtom);

  const flow = useMemo(() => {
    const foundFlow = flows.find((f) => f.id === flowId);
    if (!foundFlow) {
      throw new Error("Don't find the flow in the flows data.");
    }
    return foundFlow;
  }, [flowId, flows]);

  const updateFlow = (flow: FlowData): FlowData[] => {
    const newFlows = [...flows];
    const index = newFlows.findIndex((f) => f.id === flow.id);
    if (index === undefined) {
      console.warn("The flow is not exist in the flows data.");
    } else {
      newFlows[index] = flow;
      setFlows(newFlows);
    }
    return newFlows;
  };

  return {
    flow,
    updateFlow,
  };
};

export const useFlowList = () => {
  const [flows, setFlows] = useAtom(flowsAtom);

  const addFlow = (name: string) => {
    const flow = createFlow(name);
    setFlows([...flows, flow]);
    return flow;
  };

  return {
    flows,
    addFlow,
  };
};
