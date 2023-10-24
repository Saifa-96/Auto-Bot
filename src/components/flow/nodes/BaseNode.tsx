import { FC, PropsWithChildren } from "react";
import { styled } from "styled-components";

interface BaseNodeProps {
  background: string;
  selected: boolean;
}

export const BaseNode: FC<PropsWithChildren<BaseNodeProps>> = (props) => {
  const { children, background } = props;
  return <NodeItem style={{ background }}>{children}</NodeItem>;
};

const NodeItem = styled.div`
  width: 140px;
  height: 60px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 10px;
  color: white;
`;

