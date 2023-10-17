import { FC, PropsWithChildren, useMemo } from "react";
import { styled, CSS } from "@stitches/react";

interface HorizonBoxItemProps {
  width: number | "stretch";
  css?: CSS;
}

const BoxItem = styled("div", {});

export const HorizonBox = styled("section", {
  display: "flex",
  height: "100vh",
});

export const HorizonBoxItem: FC<PropsWithChildren<HorizonBoxItemProps>> = ({
  children,
  width,
  css,
}) => {
  const widthProps = useMemo(() => {
    if (width === "stretch") {
      return { flex: 1 };
    }
    return { width };
  }, [width]);

  return <BoxItem css={{ ...css, ...widthProps }}>{children}</BoxItem>;
};
