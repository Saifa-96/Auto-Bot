import { Flex, Box, Button } from "@radix-ui/themes";
import { useImages } from "../store";
import { ImageShowcase } from "./ImageShowcase";
import { ScreenshotButton } from ".";
import { useEffect, useMemo, useState } from "react";

export const ImageStore = () => {
  const { images, removeImages } = useImages();
  const [indices, setIndices] = useState<number[]>([]);
  const [multiple, setIsMultiple] = useState<boolean>(false);

  useEffect(() => {
    let pw = "";
    const open = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (pw === "zxcvv") {
          window.debug.openDevTools();
        }
        pw = "";
        return;
      }
      pw += e.key;
    };
    window.addEventListener("keydown", open);

    return () => {
      window.removeEventListener("keydown", open);
    };
  }, []);

  const disabledIndices = useMemo(() => {
    return images.reduce<number[]>((arr, img, index) => {
      if (img.belong.length > 0) {
        arr.push(index);
      }
      return arr;
    }, []);
  }, [images]);

  const handleCancel = () => {
    setIndices([]);
    setIsMultiple(false);
  };

  const handleDelete = () => {
    removeImages(indices);
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
            sources={images.map((v) => v.detail)}
            indices={indices}
            disabledIndices={disabledIndices}
            onIndicesChange={setIndices}
          />
        </Box>
      </Flex>
    </Box>
  );
};
