import { FC } from "react";
import { type NodeProps } from "reactflow";
import { BaseNode, CustomHandle } from "./BaseNode";
import { LoopSettings } from "../../../core/nodes/loop";

export const LoopNode: FC<NodeProps<LoopSettings>> = (node) => {
  const {
    data: { conditionals },
  } = node;

  return (
    <>
      <CustomHandle
        selected={node.selected}
        color="#815c94"
        type="target"
        pos="left"
      />
      <CustomHandle
        selected={node.selected}
        color="#815c94"
        type="source"
        pos="bottom"
      />
      {conditionals.map((conditional) => {
        return (
          <CustomHandle
            selected={node.selected}
            color="#815c94"
            key={conditional.id}
            type="source"
            id={conditional.id}
            pos="right"
          />
        );
      })}
      <BaseNode background="#815c94" selected={node.selected}>
        Loop Node
      </BaseNode>
    </>
  );
};
