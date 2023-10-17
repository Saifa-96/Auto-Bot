import { FC, useCallback } from "react";
import { Text } from "@radix-ui/themes";
import { Node, useReactFlow } from "reactflow";

import { RegionClickSettings } from "../../core";
import { TemplateInput } from "./fields/TemplateFiled";

export const RegionClickSettingsForm: FC<Node<RegionClickSettings>> = ({
  id,
  data,
}) => {
  const { region, target } = data;

  const instance = useReactFlow();
  const update = useCallback((newData: Partial<RegionClickSettings>) => {
    instance.setNodes((nodes) =>
      nodes.map((nd) => {
        if (nd.id !== id) return nd;
        (nd as Node<RegionClickSettings>).data = {
          ...nd.data,
          ...newData,
        };
        return nd;
      })
    );
  }, []);

  return (
    <div>
      <Text>Region</Text>
      <TemplateInput
        value={region}
        onChange={(value) => {
          update({ region: value });
        }}
      />

      <Text>Target</Text>
      <TemplateInput
        value={target}
        onChange={(value) => {
          update({ target: value });
        }}
      />
    </div>
  );
};
