import { Node, XYPosition } from "reactflow";
import { v4 as uuid } from "uuid";

import { NODE_TYPE } from "./base";
import { initStartSettings, getUsedImages as getImagesInStart } from "./start";
import {
  initRegionClickSettings,
  getUsedImages as getImagesInRegionClick,
} from "./region-click";
import { initLoopSettings, getUsedImages as getImagesInLoop } from "./loop";
import {
  initMatchClickSettings,
  getUsedImages as getImagesInMatchClick,
} from "./match-click";

const dataFactorMap = {
  [NODE_TYPE.START]: initStartSettings,
  [NODE_TYPE.REGION_CLICK]: initRegionClickSettings,
  [NODE_TYPE.LOOP]: initLoopSettings,
  [NODE_TYPE.MATCH_CLICK]: initMatchClickSettings,
};

export const getImages = {
  [NODE_TYPE.START]: getImagesInStart,
  [NODE_TYPE.REGION_CLICK]: getImagesInRegionClick,
  [NODE_TYPE.LOOP]: getImagesInLoop,
  [NODE_TYPE.MATCH_CLICK]: getImagesInMatchClick,
};

export function createNodeByType(
  type: NODE_TYPE,
  position: XYPosition = { x: 0, y: 0 }
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
