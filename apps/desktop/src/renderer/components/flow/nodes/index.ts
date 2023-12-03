import { type NodeTypes } from "reactflow";
import { StartNode } from "./StartNode";
import { RegionClickNode } from "./RegionClickNode";
import { LoopNode } from "./LoopNode";
import { MatchClickNode } from "./MatchClickNode";
import { NODE_TYPE } from "../../../core";

export const nodeTypes: NodeTypes = {
  [NODE_TYPE.START]: StartNode,
  [NODE_TYPE.REGION_CLICK]: RegionClickNode,
  [NODE_TYPE.LOOP]: LoopNode,
  [NODE_TYPE.MATCH_CLICK]: MatchClickNode,
};
