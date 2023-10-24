import { FC } from "react";
import { type NodeProps } from "reactflow";
import { BaseNode, CustomHandle } from "./BaseNode";

export const StartNode: FC<NodeProps> = (node) => {
  return (
    <>
      <CustomHandle
        selected={node.selected}
        color="#1ba784"
        type="source"
        pos="right"
      />
      <BaseNode background="#1ba784" selected={node.selected}>
        Start
      </BaseNode>
    </>
  );
};
