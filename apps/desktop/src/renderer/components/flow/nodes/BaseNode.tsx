import {
  CSSProperties,
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import {
  Handle,
  HandleProps,
  HandleType,
  Position,
  ReactFlowState,
  getConnectedEdges,
  useNodeId,
  useStore,
} from "reactflow";
import { styled } from "styled-components";

interface BaseNodeProps {
  background: string;
  selected: boolean;
  style?: CSSProperties;
}

export const BaseNode: FC<PropsWithChildren<BaseNodeProps>> = (props) => {
  const { children, background, selected, style } = props;
  return (
    <NodeItem selected={selected} style={{ background, ...style }}>
      {children}
    </NodeItem>
  );
};

const NodeItem = styled.div<{ selected?: boolean }>`
  min-width: 116px;
  min-height: 36px;
  font-weight: 600;
  font-size: small;
  border: 2px solid ${(props) => (props.selected ? "white" : "transparent")};
  border-radius: 10px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface CustomHandleProps extends Omit<HandleProps, "position"> {
  pos: "left" | "right" | "bottom" | "custom";
  color: string;
  selected: boolean;
  style?: CSSProperties;
}

const selector =
  (
    nodeId: string,
    handleType: HandleType,
    isConnectable = true,
    handleId?: string,
  ) =>
  (s: ReactFlowState) => {
    // If the user props say this handle is not connectable, we don't need to
    // bother checking anything else.
    if (!isConnectable) return false;

    const node = s.nodeInternals.get(nodeId)!;
    const connectedEdges = getConnectedEdges([node], s.edges);

    if (handleId) {
      const edgesConnectedWithHandleId = connectedEdges.filter(
        ({ sourceHandle, targetHandle }) =>
          sourceHandle === handleId || targetHandle === handleId,
      );
      return edgesConnectedWithHandleId.length < 1;
    }

    const filteredEdges = connectedEdges.filter(
      handleType === "source"
        ? (edge) => edge.source === nodeId
        : (edge) => edge.target === nodeId,
    );

    return filteredEdges.length < 1;
  };

export const CustomHandle: FC<CustomHandleProps> = (props) => {
  const { pos, id, type, ...rest } = props;

  const nodeId = useNodeId()!;
  const isConnectable = useStore(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(selector(nodeId, type, props.isConnectable, id), [
      nodeId,
      props.isConnectable,
    ]),
  );

  const pos_attr = useMemo(() => {
    switch (pos) {
      case "left":
        return Position.Left;
      case "right":
        return Position.Right;
      case "bottom":
        return Position.Bottom;
      default:
        return Position.Left;
    }
  }, [pos]);

  return (
    <StyledHandle
      id={id}
      type={type}
      isConnectable={isConnectable}
      position={pos_attr}
      {...rest}
    />
  );
};

const StyledHandle = styled(Handle)<{ color: string; selected: boolean }>`
  width: 10px;
  height: 10px;
  border: 2px solid ${(props) => (props.selected ? "white" : "#ccc")};
  background: ${(props) => props.color};

  &.react-flow__handle-right {
    right: -7px;
  }

  &.react-flow__handle-left {
    left: -7px;
  }

  &.react-flow__handle-bottom {
    bottom: -7px;
  }
`;
