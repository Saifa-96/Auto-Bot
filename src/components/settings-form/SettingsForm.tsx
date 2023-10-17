import { FC, useMemo } from "react";
import { useNodes } from "reactflow";
import { FlowSettingsForm } from "./FlowSettingsForm";
import { NODE_TYPE } from "../../core";

import { RegionClickSettingsForm } from "./RegionClickSettingsForm";
import { StartSettingsForm } from "./StartSettingsForm";
import { LoopSettingsForm } from "./LoopSettingsForm";
import { MatchClickSettingsForm } from "./MatchClickSettings";
import { Node } from "reactflow";

type FormMap = {
  [key: string]: FC<Node>;
};

const formMap: FormMap = {
  [NODE_TYPE.START]: StartSettingsForm,
  [NODE_TYPE.REGION_CLICK]: RegionClickSettingsForm,
  [NODE_TYPE.LOOP]: LoopSettingsForm,
  [NODE_TYPE.MATCH_CLICK]: MatchClickSettingsForm,
};

export const SettingsForm: FC = () => {
  const nodes = useNodes();
  const selectedNode = useMemo(() => {
    return nodes.filter((node) => node.selected);
  }, [nodes]);

  if (selectedNode.length === 1) {
    const node = selectedNode[0];
    const Form = formMap[node.type as NODE_TYPE];
    return <Form key={node.id} {...node} />;
  }

  return <FlowSettingsForm />;
};
