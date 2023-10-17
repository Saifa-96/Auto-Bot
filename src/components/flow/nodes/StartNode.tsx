import { FC } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";

export const StartNode: FC<NodeProps> = () => {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      <BaseNode background="green">Start</BaseNode>
    </>
  );
};
