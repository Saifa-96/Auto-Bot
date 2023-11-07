import { FC, useCallback } from "react";
import { Button } from "@radix-ui/themes";
import { useImages } from "@/store";
import { ImageData } from "@/core";

interface ScreenshotButtonProps {
  onAddImage?: (imageData: ImageData) => void;
}

function useScreenshot() {
  const { addImage } = useImages();
  const takeScreenshot = useCallback(async () => {
    const imageURL = await window.screenshot.takeScreenshot();
    const imageData = addImage(imageURL);
    return imageData;
  }, [addImage]);
  return takeScreenshot;
}

export const ScreenshotButton: FC<ScreenshotButtonProps> = (props) => {
  const { onAddImage } = props;

  const takeScreenshot = useScreenshot();
  const capture = useCallback(async () => {
    const imageData = await takeScreenshot();
    onAddImage?.(imageData);
  }, [onAddImage, takeScreenshot]);

  return (
    <Button size="1" onClick={capture}>
      Screenshot
    </Button>
  );
};
