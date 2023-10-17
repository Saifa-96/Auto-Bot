import { FC, useEffect, useState } from "react";
import { styled } from "@stitches/react";

export const Monitor: FC = () => {
  const [areas, setAreas] = useState<[number, number, number, number][]>([]);

  useEffect(() => {
    const off = window.screenshot.detectedAreas((areas) => {
      setAreas(areas);
    });

    return () => {
      off();
    };
  }, []);

  return (
    <Win>
      {areas.toString()}
      {areas.map(([x, y, w, h]) => (
        <AreaBox
          css={{
            left: x,
            top: y,
            width: w,
            height: h,
          }}
        />
      ))}
      <Handle />
    </Win>
  );
};

const AreaBox = styled("div", {
  border: "1px solid red",
  position: "absolute",
});

const Win = styled("div", {
  height: "100vh",
  boxSizing: "border-box",
  border: "2px solid #ccc",
  position: "relative",
});

const Handle = styled("div", {
  width: 30,
  height: 30,
  position: "absolute",
  bottom: 0,
  right: 0,
  background: "Azure",
  "-webkit-user-select": "none",
  "-webkit-app-region": "drag",
});
