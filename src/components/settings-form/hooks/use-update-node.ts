import { useCallback } from "react";
import { type Node, useReactFlow, useUpdateNodeInternals } from "reactflow";
import { produce } from "immer";

export const useUpdateNode = <T>() => {
  const instance = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const update = useCallback(
    (node: Node<T>) => {
      sessionStorage.setItem("editing-state", "true");
      instance.setNodes((nodes) =>
        nodes.map((nd) => {
          if (nd.id !== node.id) return nd;
          return node;
        })
      );
      updateNodeInternals(node.id);
    },
    [instance]
  );
  return { update, produce };
};
