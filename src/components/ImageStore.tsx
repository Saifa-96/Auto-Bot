import { Flex, Box } from "@radix-ui/themes";
import { useImages } from "../store";
import { ImageShowcase } from "./ImageShowcase";
import { ScreenshotButton } from ".";

export const ImageStore = () => {
  const { images } = useImages();
  return (
    <Flex direction="column" gap="2" p="2">
      <ScreenshotButton />
      <Box grow="1">
        <ImageShowcase sources={images.map((v) => v.detail)} />
      </Box>
    </Flex>
  );
};
