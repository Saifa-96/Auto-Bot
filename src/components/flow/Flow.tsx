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
  Panel,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
  Node,
  ReactFlowJsonObject,
} from "reactflow";
import { nodeTypes } from "./nodes";
import { useFlow, useUpdateMonitor } from "../../store";
import { NODE_TYPE, createNodeByType } from "../../core";
import { Button } from "@radix-ui/themes";
import "reactflow/dist/style.css";

const proOptions = { hideAttribution: true };

const simplifyFlowData = (obj: ReactFlowJsonObject) => {
  const { nodes } = obj;
  const simplifiedNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: node.data,
    position: node.position,
  }));
  return { ...obj, nodes: simplifiedNodes };
};

export const Flow: FC = () => {
  const instance = useReactFlow();
  const { flowId } = useParams();
  const { flow, updateFlow } = useFlow(flowId!);

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

  const onSave = useCallback(() => {
    const jsonObj = instance.toObject();
    const flowData = simplifyFlowData(jsonObj);

    updateFlow(
      {
        id: flow.id,
        name: flow.name,
        ...flowData,
      },
      async (state) => {
        console.log('save data: ', state)
        window.configFile.save(JSON.stringify(state));
      }
    );

    console.log("json data", jsonObj);
  }, []);

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
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button onClick={onSave}>Save</Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
