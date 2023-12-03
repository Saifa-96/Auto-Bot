import { FC, useEffect, useState } from "react";
import { MoveIcon } from "@radix-ui/react-icons";
import { styled } from "styled-components";

const Monitor: FC = () => {
  const [areas, setAreas] = useState<[number, number, number, number][]>([]);

  useEffect(() => {
    const off = window.monitor.drawMatchedRegion((areas) => {
      setAreas(areas);
    });

    return () => {
      off();
    };
  }, []);

  return (
    <Win>
      {areas.map(([x, y, w, h]) => (
        <AreaBox
          style={{
            left: x,
            top: y,
            width: w,
            height: h,
          }}
        />
      ))}
      <Handle>
        <MoveIcon color="skyblue" width={25} height={25} />
      </Handle>
    </Win>
  );
};

const AreaBox = styled.div`
  border: 2px solid red;
  position: absolute;
`;

const Win = styled.div`
  height: 100vh;
  box-sizing: border-box;
  border: 2px solid skyblue;
  position: relative;
`;

const Handle = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  // electron attrs
  -webkit-user-select: none;
  -webkit-app-region: drag;
`;

export default Monitor
