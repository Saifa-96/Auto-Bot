import { FC, useCallback } from "react";
import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import { xor } from "lodash";

interface ImageShowcaseProps {
  sources: string[];
  multiple?: boolean;
  selectable?: boolean;
  disabledIndices?: number[];

  index?: number | null;
  onIndexChange?: (i: number) => void;

  indices?: number[];
  onIndicesChange?: (indices: number[]) => void;
}

export const ImageShowcase: FC<ImageShowcaseProps> = (props) => {
  const {
    sources,
    multiple = false,
    selectable = true,
    disabledIndices = [],
    index,
    onIndexChange,
    indices = [],
    onIndicesChange,
  } = props;

  const handleSelect = useCallback(
    (i: number) => {
      if (!selectable) return;

      if (multiple) {
        const newIndices = xor(indices, [i]);
        onIndicesChange?.(newIndices);
      } else {
        onIndexChange?.(i);
      }
    },
    [selectable, multiple, indices, onIndicesChange, onIndexChange],
  );

  return (
    <Flex wrap="wrap" gap="2">
      {sources.map((src, i) => (
        <ImageShowcaseItem
          key={src}
          src={src}
          disabled={disabledIndices.includes(i)}
          isSelected={
            selectable && (multiple ? indices.includes(i) : i === index)
          }
          onClick={() => handleSelect(i)}
        />
      ))}
    </Flex>
  );
};

const ImageShowcaseItem: FC<{
  isSelected: boolean;
  src: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ isSelected, src, onClick, disabled }) => {
  return (
    <Box
      style={{
        width: 60,
        height: 60,
        borderRadius: 5,
        ...(isSelected
          ? { border: "2px solid orange" }
          : { border: "2px solid #ccc" }),
        ...(disabled ? { background: "red" } : {}),
      }}
      onClick={() => !disabled && onClick()}
    >
      <ImageItem src={src} />
    </Box>
  );
};

const ImageItem = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  vertical-align: top;
  user-select: none;
  pointer-events: none;
`;
