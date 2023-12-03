import { Node, XYPosition } from "reactflow";
import { v4 as uuid } from "uuid";

import {
  NODE_TYPE,
  StartSettingsHandler,
  RegionClickSettingsHandler,
  MatchClickSettingsHandler,
  LoopSettingsHandler,
} from "./nodes";

const dataFactorMap = {
  [NODE_TYPE.START]: StartSettingsHandler.new,
  [NODE_TYPE.REGION_CLICK]: RegionClickSettingsHandler.new,
  [NODE_TYPE.LOOP]: LoopSettingsHandler.new,
  [NODE_TYPE.MATCH_CLICK]: MatchClickSettingsHandler.new,
};

export const getImages = {
  [NODE_TYPE.START]: StartSettingsHandler.getUsedImages,
  [NODE_TYPE.REGION_CLICK]: RegionClickSettingsHandler.getUsedImages,
  [NODE_TYPE.LOOP]: LoopSettingsHandler.getUsedImages,
  [NODE_TYPE.MATCH_CLICK]: MatchClickSettingsHandler.getUsedImages,
};

export function createNodeByType(
  type: NODE_TYPE,
  position: XYPosition = { x: 0, y: 0 },
): Node {
  const data = dataFactorMap[type]();
  return createNode({ type, data, position });
}

interface CreateNodeProps<T> {
  type: NODE_TYPE;
  data: T;
  position: XYPosition;
}

function createNode<T = object>(props: CreateNodeProps<T>): Node<T> {
  const { type, data, position = { x: 0, y: 0 } } = props;
  return {
    id: uuid(),
    type,
    data,
    position,
  };
}
