import { FC } from "react";
import { type NodeProps } from "reactflow";
import { BaseNode, CustomHandle } from "./BaseNode";
import { LoopSettings } from "../../../core/nodes/loop";
import { Box, Text } from "@radix-ui/themes";

export const LoopNode: FC<NodeProps<LoopSettings>> = (node) => {
  const {
    data: { conditionals },
  } = node;

  return (
    <>
      <CustomHandle
        selected={node.selected}
        color="#815c94"
        type="source"
        pos="bottom"
      />
      <BaseNode background="#815c94" selected={node.selected}>
        <Box position="relative" style={{ height: 36, width: "100%", textAlign: 'center' }}>
          <CustomHandle
            selected={node.selected}
            color="#815c94"
            type="target"
            pos="left"
          />
          <Text as="p" style={{ height: 36, verticalAlign: 'middle' }}>Loop</Text>
        </Box>
        {conditionals.map((conditional) => {
          return (
            <Box
              display="block"
              width="100%"
              key={conditional.id}
              position="relative"
              px="3"
              style={{ borderTop: "1px solid #ccc", height: 23, boxSizing: "border-box" }}
            >
              <Text as="p" align="center">
                {conditional.name}
              </Text>
              <CustomHandle
                selected={node.selected}
                color="#815c94"
                key={conditional.id}
                type="source"
                id={conditional.id}
                pos="right"
              />
            </Box>
          );
        })}
      </BaseNode>
    </>
  );
};
