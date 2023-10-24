import { CSSProperties, FC, PropsWithChildren, useMemo } from "react";
import { styled } from "styled-components";

interface HorizonBoxItemProps {
  width: number | "stretch";
  style?: CSSProperties;
}

export const HorizonBox = styled.section`
  display: flex;
  height: 100vh;
`;

export const HorizonBoxItem: FC<PropsWithChildren<HorizonBoxItemProps>> = ({
  children,
  width,
  style,
}) => {
  const widthProps = useMemo<CSSProperties>(() => {
    if (width === "stretch") {
      return { flex: 1 };
    }
    return { width };
  }, [width]);

  return <div style={{ ...style, ...widthProps }}>{children}</div>;
};
