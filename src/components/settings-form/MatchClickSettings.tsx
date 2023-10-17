import { FC, useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import { Text } from "@radix-ui/themes";
import { TemplatesInput } from "./fields";
import { MatchClickSettings } from "../../core/nodes/match-click";

export const MatchClickSettingsForm: FC<Node<MatchClickSettings>> = (props) => {
  const {
    id,
    data: { targets },
  } = props;

  const instance = useReactFlow();
  const update = useCallback((newData: MatchClickSettings) => {
    instance.setNodes((nodes) =>
      nodes.map((nd) => {
        if (nd.id !== id) return nd;
        (nd as Node<MatchClickSettings>).data = {
          ...nd.data,
          ...newData,
        };
        return nd;
      })
    );
  }, []);

  return (
    <div>
      <Text>Targets</Text>
      <TemplatesInput
        value={targets}
        onChange={(v) => update({ targets: v })}
      />
    </div>
  );
};

