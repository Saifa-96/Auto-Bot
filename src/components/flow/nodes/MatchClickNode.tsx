import { FC } from "react";
import { type NodeProps } from "reactflow";
import { BaseNode, CustomHandle } from "./BaseNode";

export const MatchClickNode: FC<NodeProps> = (node) => {
  return (
    <>
      <CustomHandle
        selected={node.selected}
        color="#1772b4"
        type="target"
        pos="left"
      />
      <CustomHandle
        selected={node.selected}
        color="#1772b4"
        type="source"
        pos="right"
      />
      <BaseNode background="#1772b4" selected={node.selected}>
        Match Click
      </BaseNode>
    </>
  );
};
