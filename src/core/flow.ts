import type { Node, Edge, Viewport } from "reactflow";
import { NODE_TYPE, createNodeByType } from "./nodes";
import { v4 as uuid } from "uuid";

export interface FlowData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

export const createFlow = (): FlowData => {
  const nodes = [createNodeByType(NODE_TYPE.START)];
  const flowData: FlowData = {
    id: uuid(),
    name: "New Flow",
    viewport: { x: 0, y: 0, zoom: 1 },
    nodes,
    edges: [],
  };
  return flowData;
};
