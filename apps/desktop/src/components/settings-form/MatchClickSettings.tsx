import { FC, useCallback } from "react";
import { Node } from "reactflow";
import { Text } from "@radix-ui/themes";

import { TemplateItem, MatchClickSettings } from "@/core";
import { TemplatesInput } from "./fields";
import { useUpdateNode } from "./hooks";

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
    [produce, node, update],
  );

  return (
    <div>
      <Text>Targets</Text>
      <TemplatesInput value={targets} onChange={updateTargets} />
    </div>
  );
};
