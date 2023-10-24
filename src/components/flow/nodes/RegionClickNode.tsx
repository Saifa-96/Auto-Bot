import { FC } from "react";
import { type NodeProps } from "reactflow";

import { BaseNode, CustomHandle } from "./BaseNode";

export const RegionClickNode: FC<NodeProps> = (node) => {
  return (
    <>
      <CustomHandle
        selected={node.selected}
        color="#61649f"
        type="target"
        pos="left"
      />
      <CustomHandle
        selected={node.selected}
        color="#61649f"
        type="source"
        pos="right"
      />
      <BaseNode background="#61649f" selected={node.selected}>
        Region Click Node
      </BaseNode>
    </>
  );
};
