import { FC, useEffect, useState, useRef, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const calcRect = (startPoint: Point, endPoint: Point): Rect => {
  return {
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
    w: Math.abs(startPoint.x - endPoint.x),
    h: Math.abs(startPoint.y - endPoint.y),
  };
};

export const Screenshot: FC = () => {
  const [imageURL, setImageURL] = useState("");
  const canvasDom = useRef<HTMLCanvasElement>(null);
  const startPoint = useRef<Point | null>(null);

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    startPoint.current = { x: e.pageX, y: e.pageY };
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (!startPoint.current) return;

    const ctx = canvasDom.current?.getContext("2d");
    if (!ctx || !canvasDom.current) return;

    ctx.clearRect(0, 0, canvasDom.current.width, canvasDom.current.height);

    const { innerWidth, innerHeight } = window;
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    const currentPoint: Point = { x: e.pageX, y: e.pageY };
    const rect = calcRect(startPoint.current!, currentPoint);
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const currentPoint: Point = { x: e.pageX, y: e.pageY };
    const rect = calcRect(startPoint.current!, currentPoint);
    startPoint.current = null;
    window.screenshot.cropScreenshot({
      x: rect.x,
      y: rect.y,
      width: rect.w,
      height: rect.h,
    });
  }, []);

  useEffect(() => {
    const ctx = canvasDom.current?.getContext("2d");
    if (ctx) {
      const { innerWidth, innerHeight } = window;
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
    }
  }, [canvasDom]);

  useEffect(() => {
    window.screenshot.capturedScreen().then(({ imageURL }) => {
      setImageURL(imageURL);
    });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <section style={{ position: "relative", cursor: "crosshair" }}>
      <canvas
        ref={canvasDom}
        style={{ verticalAlign: "top", position: "absolute", left: 0, top: 0 }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <img src={imageURL} style={{ verticalAlign: "top", width: "100%" }} />
    </section>
  );
};
