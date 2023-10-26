import { FC, useCallback } from "react";
import { Node } from "reactflow";
import { Text } from "@radix-ui/themes";
import { TemplatesInput } from "./fields";
import { MatchClickSettings } from "../../core/nodes/match-click";
import { useUpdateNode } from "./hooks";
import { TemplateItem } from "../../core";

export const MatchClickSettingsForm: FC<Node<MatchClickSettings>> = (node) => {
  const {
    data: { targets },
  } = node;

  const { update, produce } = useUpdateNode<MatchClickSettings>();
  
  const updateTargets = useCallback(
    (v: TemplateItem[]) => {
      const newNode = produce(node, (draft) => {
        draft.data = { targets: v };
      });
      update(newNode);
    },
    [update, node]
  );

  return (
    <div>
      <Text>Targets</Text>
      <TemplatesInput value={targets} onChange={updateTargets} />
    </div>
  );
};
