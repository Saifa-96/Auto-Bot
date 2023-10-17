import { useCallback } from "react";
import { useReactFlow } from "reactflow";

export const useEdgesManage = () => {
  const instance = useReactFlow();
  const removeEdgeBySourceHandle = useCallback((sourceHandle: string) => {
    instance.setEdges((edges) => {
      return edges.filter((edge) => edge.sourceHandle !== sourceHandle);
    });
  }, []);

  return {
    removeEdgeBySourceHandle,
  };
};
