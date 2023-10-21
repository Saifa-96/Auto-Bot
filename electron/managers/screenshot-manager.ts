import {
  screen,
  desktopCapturer,
  systemPreferences,
  type Rectangle,
  type NativeImage,
} from "electron";

class ScreenshotManager {
  private _image: NativeImage | null;
  private _scaleFactor: number | null;
  constructor() {
    this._image = null;
    this._scaleFactor = null;
  }

  checkScreenPreferences = checkScreenPreferences;

  async capture(): Promise<string> {
    const { image, scaleFactor } = await captureScreen();
    this._image = image;
    this._scaleFactor = scaleFactor;
    return this._image.toDataURL();
  }

  crop(area: Rectangle): string {
    if (!this._image || !this._scaleFactor) {
      throw new Error("Losing captured screen image");
    }
    const croppedImage = cropImage(this._image, area, this._scaleFactor);
    this._image = null;
    this._scaleFactor = null;
    return croppedImage.toDataURL();
  }
}

const checkScreenPreferences = () => {
  const status = systemPreferences.getMediaAccessStatus("screen");
  return status === "granted";
};

const captureScreen = async () => {
  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();

  // Get its size
  const { width, height } = primaryDisplay.size;

  // Set up the options for the desktopCapturer
  const options: Electron.SourcesOptions = {
    types: ["screen"],
    thumbnailSize: {
      width: width * primaryDisplay.scaleFactor,
      height: height * primaryDisplay.scaleFactor,
    },
  };

  // Get the sources
  const sources = await desktopCapturer.getSources(options);

  // Find the primary display's source
  const primarySource = sources.find(
    ({ display_id }) => Number(display_id) == primaryDisplay.id
  );

  // Get the image
  const image = primarySource?.thumbnail!;

  // Return image data
  return { image, scaleFactor: primaryDisplay.scaleFactor };
};

const cropImage = (
  image: NativeImage,
  area: Rectangle,
  scaleFactor: number
) => {
  const { width, height } = image.getSize();
  const scaledWidth = Math.floor(width / scaleFactor);
  const scaledHeight = Math.floor(height / scaleFactor);
  const scaledImage = image.resize({
    width: scaledWidth,
    height: scaledHeight,
  });
  const croppedImage = scaledImage.crop(area);
  return croppedImage;
};

export const sctMgr = new ScreenshotManager();
