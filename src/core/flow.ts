import type { Node, Edge, Viewport } from "reactflow";
import { NODE_TYPE } from "./nodes";
import { v4 as uuid } from "uuid";
import { createNodeByType } from "./manager";

export interface FlowData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

export const createFlow = (flowName: string = "New Flow"): FlowData => {
  const nodes = [createNodeByType(NODE_TYPE.START, { x: 20, y: 100 })];
  const flowData: FlowData = {
    id: uuid(),
    name: flowName,
    viewport: { x: 0, y: 0, zoom: 1 },
    nodes,
    edges: [],
  };
  return flowData;
};
