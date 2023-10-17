import { styled } from "@stitches/react";
import { FC, PropsWithChildren } from "react";

interface BaseNodeProps {
  background: string;
}

export const BaseNode: FC<PropsWithChildren<BaseNodeProps>> = (props) => {
  const { children, background } = props;
  return <NodeItem css={{ background }}>{children}</NodeItem>;
};

const NodeItem = styled("div", {
  width: 140,
  height: 60,
  boxSizing: "border-box",
  border: "2px solid #ccc",
  borderRadius: 10,
  color: 'White'
});
