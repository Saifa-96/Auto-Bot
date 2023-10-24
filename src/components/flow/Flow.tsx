import {
  DragEventHandler,
  FC,
  useCallback,
  useEffect,
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
} from "reactflow";
import { nodeTypes } from "./nodes";
import { useFlow, useUpdateMonitor } from "../../store";
import { NODE_TYPE, createNodeByType } from "../../core";
import "reactflow/dist/style.css";
import { TopPanel } from "./Panel";

const proOptions = { hideAttribution: true };

export const Flow: FC = () => {
  const instance = useReactFlow();
  const { flowId } = useParams();
  const { flow } = useFlow(flowId!);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes, edges, viewport } = flow;
    setNodes(nodes);
    setEdges(edges);
    instance.setViewport(viewport);
  }, [flowId]);

  const updateMonitor = useUpdateMonitor();
  useEffect(() => {
    const off = window.monitor.onChangedGeometry((region) => {
      updateMonitor(region);
    });
    return () => {
      off();
    };
  }, [updateMonitor]);

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
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
        "application/reactflow"
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

      setNodes((nds) => nds.concat(newNode));
    },
    [instance]
  );

  return (
    <div style={{ height: "100%" }} ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapGrid={[20, 20]}
        snapToGrid
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { strokeWidth: 3 },
        }}
        style={{ background: "#393939" }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background />
        <Controls />
        <TopPanel />
      </ReactFlow>
    </div>
  );
};
