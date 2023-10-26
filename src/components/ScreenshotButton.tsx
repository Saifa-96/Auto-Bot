import { FC, useCallback } from "react";
import { useAddImage } from "../store";
import { Button } from "@radix-ui/themes";
import { ImageData } from "../core";

interface ScreenshotButtonProps {
  onAddImage?: (imageData: ImageData) => void;
}

export function useScreenshot() {
  const addImage = useAddImage();
  const takeScreenshot = useCallback(async () => {
    const imageURL = await window.screenshot.takeScreenshot();
    const imageData = addImage(imageURL);
    return imageData;
  }, []);
  return takeScreenshot;
}

export const ScreenshotButton: FC<ScreenshotButtonProps> = (props) => {
  const { onAddImage } = props;

  const takeScreenshot = useScreenshot();
  const capture = useCallback(async () => {
    const imageData = await takeScreenshot();
    onAddImage?.(imageData);
  }, [onAddImage]);

  return <Button onClick={capture}>Screenshot</Button>;
};
