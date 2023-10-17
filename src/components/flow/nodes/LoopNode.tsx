import { FC } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import { LoopSettings } from "../../../core/nodes/loop";

export const LoopNode: FC<NodeProps<LoopSettings>> = (node) => {
  const {
    data: { conditionals },
  } = node;

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      {conditionals.map((conditional) => {
        return (
          <Handle
            key={conditional.id}
            type="source"
            id={conditional.id}
            position={Position.Right}
          />
        );
      })}
      <BaseNode background="#777">Loop Node</BaseNode>
    </>
  );
};
