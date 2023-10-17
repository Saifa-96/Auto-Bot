import { Rectangle, screen } from "electron";

export interface Display extends Rectangle {
  scaleFactor: number;
}

export const getDisplay = (): Display => {
  const point = screen.getCursorScreenPoint();
  const { bounds, scaleFactor } = screen.getDisplayNearestPoint(point);

  // https://github.com/nashaofu/screenshots/issues/98
  return {
    x: Math.floor(bounds.x),
    y: Math.floor(bounds.y),
    width: Math.floor(bounds.width),
    height: Math.floor(bounds.height),
    scaleFactor,
  };
};
