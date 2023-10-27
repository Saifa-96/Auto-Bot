import { FC } from "react";
import { type NodeProps } from "reactflow";
import { styled } from "styled-components";
import { BaseNode, CustomHandle } from "./BaseNode";
import { LoopSettings } from "../../../core/nodes/loop";
import { Box, Inset, Separator, Text } from "@radix-ui/themes";

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
      <BaseNode background="#815c94" selected={node.selected}>
        <Box py="2">Loop</Box>
        {conditionals.map((conditional) => {
          return (
            <Box
              display="block"
              width="100%"
              key={conditional.id}
              position="relative"
              py="1"
              px="2"
              style={{ borderTop: "1px solid #ccc" }}
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
