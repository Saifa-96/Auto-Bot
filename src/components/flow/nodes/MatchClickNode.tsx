import { FC } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MatchClickNode: FC<NodeProps> = () => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <BaseNode background="#444">Match Click Node</BaseNode>
    </>
  );
};
