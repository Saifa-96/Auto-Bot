import { FC, useCallback, useRef, useState } from "react";
import {
  Flex,
  Button,
  TextFieldInput,
  IconButton,
  Kbd,
  Text,
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import { Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
import { Panel, ReactFlowJsonObject, useReactFlow } from "reactflow";
import { useFlow, useImages, useMonitor } from "../../store";

interface TopPanelProps {
  flowId: string;
}

export const TopPanel: FC<TopPanelProps> = ({ flowId }) => {
  const instance = useReactFlow();
  const { flow, updateFlow } = useFlow(flowId);
  const { images } = useImages();
  const { area } = useMonitor();

  const onSave = useCallback(
    async (flowName?: string) => {
      const jsonObj = instance.toObject();
      const flowData = simplifyFlowData(jsonObj);

      const flows = updateFlow({
        id: flow.id,
        name: flowName ?? flow.name,
        ...flowData,
      });

      console.log("save data: ", flows);
      await window.configFile.save(
        JSON.stringify({ flows, monitor: area, images }),
      );

      sessionStorage.setItem("editing-state", "false");
      toast.success("Successfully saved", { autoClose: 1000 });
    },
    [area, flow.id, flow.name, images, instance, updateFlow],
  );

  const [executing, setExecuteState] = useState<boolean>(false);

  const handleTurnOnBot = useCallback(async () => {
    const result = await window.monitor.isShow();
    if (!result) {
      toast.error("Please, Turn on the monitor before executing the bot.");
      return;
    }

    const state = sessionStorage.getItem("editing-state");
    if (state === "true") {
      toast.error("Please, save the config file before executing the bot.");
      return;
    }

    setExecuteState(true);
    await window.bot.turnOn(flow.id);
    setExecuteState(false);
  }, [flow]);

  return (
    <>
      <Panel position="top-left">
        <FlowNameInput defaultValue={flow.name} onChange={onSave} />
      </Panel>

      <Panel position="top-right">
        <Flex gap="3">
          {executing ? (
            <Text style={{ color: "white" }}>
              Press <Kbd>F1</Kbd> for stopping the bot process
            </Text>
          ) : (
            <Button size="1" color="orange" onClick={handleTurnOnBot}>
              Execute
            </Button>
          )}
          <Button color="cyan" size="1" onClick={() => onSave()}>
            Save
          </Button>
        </Flex>
      </Panel>
    </>
  );
};

interface FlowNameInputProps {
  defaultValue: string;
  onChange: (v: string) => void;
}

const FlowNameInput: FC<FlowNameInputProps> = ({ defaultValue, onChange }) => {
  const [editing, setEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveFlowName = useCallback(() => {
    const value = inputRef.current?.value;
    setEditing(false);
    onChange(value!);
  }, [onChange]);

  if (editing) {
    return (
      <Flex gap="2">
        <TextFieldInput
          ref={inputRef}
          size="1"
          autoFocus
          defaultValue={defaultValue}
        />
        <IconButton size="1" onClick={saveFlowName}>
          <CheckIcon />
        </IconButton>
        <IconButton size="1" color="ruby" onClick={() => setEditing(false)}>
          <Cross2Icon />
        </IconButton>
      </Flex>
    );
  }

  return (
    <Button
      variant="ghost"
      style={{ color: "whitesmoke" }}
      onClick={() => setEditing(true)}
    >
      {defaultValue}
    </Button>
  );
};

const simplifyFlowData = (obj: ReactFlowJsonObject) => {
  const { nodes, edges } = obj;
  const simplifiedNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: node.data,
    position: node.position,
  }));
  const simplifiedEdges = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    sourceHandle: edge.sourceHandle,
    target: edge.target,
    targetHandle: edge.targetHandle,
  }));
  return { ...obj, nodes: simplifiedNodes, edges: simplifiedEdges };
};
