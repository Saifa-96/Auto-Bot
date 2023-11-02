import {
  DragEventHandler,
  FC,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
  Node,
  ReactFlowProps,
} from "reactflow";
import { ToastContainer } from "react-toastify";

import { mergeProps } from "@react-aria/utils";
import { nodeTypes } from "./nodes";
import { useFlow } from "../../store";
import { NODE_TYPE, createNodeByType } from "../../core";
import { TopPanel } from "./TopPanel";

import "reactflow/dist/style.css";

export const Flow: FC = () => {
  const { flowId } = useParams();
  const { flow } = useFlow(flowId!);
  const { reactFlowWrapper, reactflowProps, setFlow } = useFlowOperation();
  const collectFlowEditingState = useFlowEditingState();

  useEffect(() => {
    const { nodes, edges } = flow;
    setFlow(nodes, edges);
  }, [flow, flowId, setFlow]);

  const flowProps = useMemo(() => {
    return mergeProps(reactflowProps, collectFlowEditingState);
  }, [reactflowProps, collectFlowEditingState]);

  return (
    <div style={{ height: "100%" }} ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        snapGrid={[10, 10]}
        snapToGrid
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { strokeWidth: 3 },
        }}
        style={{ background: "#393939" }}
        {...flowProps}
      >
        <Background />
        <ToastContainer
          style={{ position: "absolute" }}
          position="bottom-right"
        />
        <Controls />
        <TopPanel />
      </ReactFlow>
    </div>
  );
};

interface UseFlowOperationReturn {
  reactFlowWrapper: RefObject<HTMLDivElement>;
  reactflowProps: ReactFlowProps;
  setFlow: (nodes: Node[], edges: Edge[]) => void;
}

const useFlowOperation = (): UseFlowOperationReturn => {
  const instance = useReactFlow();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback<OnNodesChange>((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange>((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback<DragEventHandler>((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback<DragEventHandler>(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData(
        "application/reactflow",
      ) as NODE_TYPE;

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type || !reactFlowBounds) {
        return;
      }

      const position = instance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = createNodeByType(type, position);

      // setNodes((nds) => nds.concat(newNode));
      instance.addNodes([newNode]);
    },
    [instance],
  );

  const setFlow = useCallback((nodes: Node[], edges: Edge[]) => {
    setNodes(nodes);
    setEdges(edges);
  }, []);

  return {
    reactFlowWrapper,
    reactflowProps: {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onDrop,
      onDragOver,
    },
    setFlow,
  };
};

const setEditingState = () => {
  sessionStorage.setItem("editing-state", "true");
};

const useFlowEditingState = (): ReactFlowProps => {
  const onNodesChange = useCallback<OnNodesChange>((changes) => {
    if (
      changes.some(
        (c) => c.type === "remove" || (c.type === "position" && c.dragging),
      )
    ) {
      setEditingState();
    }
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange>((changes) => {
    if (changes.some((c) => c.type === "remove")) {
      setEditingState();
    }
  }, []);

  const onConnect = useCallback<OnConnect>(() => {
    setEditingState();
  }, []);

  const onDrop = useCallback(() => {
    setEditingState();
  }, []);

  return {
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
  };
};
