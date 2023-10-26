import { Box, Flex } from "@radix-ui/themes";
import { FC } from "react";
import styled from "styled-components";

interface ImageShowcaseProps {
  sources: string[];
  index?: number | null;
  onIndexChange?: (i: number) => void;
}

export const ImageShowcase: FC<ImageShowcaseProps> = (props) => {
  const { sources, index, onIndexChange } = props;
  return (
    <Flex wrap="wrap" gap="2">
      {sources.map((src, i) => (
        <ImageShowcaseItem
          isSelected={i === index}
          key={src}
          src={src}
          onClick={() => onIndexChange?.(i)}
        />
      ))}
    </Flex>
  );
};

const ImageShowcaseItem: FC<{
  isSelected: boolean;
  src: string;
  onClick: () => void;
}> = ({ isSelected, src, onClick }) => {
  return (
    <Box
      style={{
        width: 60,
        height: 60,
        borderRadius: 5,
        ...(isSelected
          ? { border: "2px solid orange" }
          : { border: "2px solid #ccc" }),
      }}
      onClick={onClick}
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
`;
