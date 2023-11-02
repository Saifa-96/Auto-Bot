import { FC, useCallback } from "react";
import { Text } from "@radix-ui/themes";
import { Node } from "reactflow";

import { RegionClickSettings } from "../../core";
import { TemplateInput } from "./fields/TemplateFiled";
import { useUpdateNode } from "./hooks";

export const RegionClickSettingsForm: FC<Node<RegionClickSettings>> = (
  node,
) => {
  const { data } = node;
  const { region, target } = data;

  const { update, produce } = useUpdateNode();
  const handleUpdateField = useCallback(
    (v: Partial<RegionClickSettings>) => {
      const newNode = produce(node, (draft) => {
        draft.data = { ...draft.data, ...v };
      });
      update(newNode);
    },
    [node, produce, update],
  );

  return (
    <div>
      <Text>Region</Text>
      <TemplateInput
        value={region}
        onChange={(value) => {
          handleUpdateField({ region: value });
        }}
      />

      <Text>Target</Text>
      <TemplateInput
        value={target}
        onChange={(value) => {
          handleUpdateField({ target: value });
        }}
      />
    </div>
  );
};
