import { FC } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";

export const RegionClickNode: FC<NodeProps> = () => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <BaseNode background="#999">Region Click Node</BaseNode>
    </>
  );
};
