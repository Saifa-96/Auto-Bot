import { useMemo, useState } from "react";
import { Flex, Box, Button } from "@radix-ui/themes";
import { has } from "lodash";

import { useFlowList, useImages } from "@/store";
import { NODE_TYPE, getImages } from "@/core";
import { ImageShowcase } from "./ImageShowcase";
import { ScreenshotButton } from "./ScreenshotButton";

export const ImageStore = () => {
  const { flows } = useFlowList();
  const { images, removeImagesByIndices } = useImages();
  const [indices, setIndices] = useState<number[]>([]);
  const [multiple, setIsMultiple] = useState<boolean>(false);

  const imageItems = useMemo(() => {
    const imageMap: { [key: string]: string[] } = {};
    const collect = (nodeId: string, imageIds: string[]) => {
      imageIds.forEach((imageId) => {
        if (!has(imageMap, imageId)) {
          imageMap[imageId] = [nodeId];
          return;
        }
        if (!imageMap[imageId].includes(nodeId)) {
          imageMap[imageId].push(nodeId);
        }
      });
    };

    flows.forEach((flow) => {
      flow.nodes.forEach((node) => {
        const type = node.type! as NODE_TYPE;
        const imageIds = getImages[type](node.data);
        collect(node.id, imageIds);
      });
    });

    return images.map((i) => ({ ...i, belong: imageMap[i.id] ?? [] }));
  }, [flows, images]);

  const disabledIndices = useMemo(() => {
    return imageItems.reduce<number[]>((arr, img, index) => {
      if (img.belong.length > 0) {
        arr.push(index);
      }
      return arr;
    }, []);
  }, [imageItems]);

  const handleCancel = () => {
    setIndices([]);
    setIsMultiple(false);
  };

  const handleDelete = () => {
    removeImagesByIndices(indices);
    handleCancel();
  };

  return (
    <Box grow="1">
      <Flex direction="column" gap="2" p="2">
        <Flex justify="between">
          <ScreenshotButton />

          <Box>
            {multiple ? (
              <>
                <Button size="1" color="red" mr="2" onClick={handleDelete}>
                  Delete
                </Button>
                <Button size="1" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="1" onClick={() => setIsMultiple(true)}>
                Multiple Select
              </Button>
            )}
          </Box>
        </Flex>
        <Box grow="1">
          <ImageShowcase
            multiple={multiple}
            sources={imageItems.map((v) => v.detail)}
            indices={indices}
            disabledIndices={disabledIndices}
            onIndicesChange={setIndices}
          />
        </Box>
      </Flex>
    </Box>
  );
};
