import { FC, useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Flex,
  Button,
  TextFieldInput,
  IconButton,
  Kbd,
  Text,
} from "@radix-ui/themes";
import { Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
import { Panel, ReactFlowJsonObject, useReactFlow } from "reactflow";
import { useFlow } from "../../store";

export const TopPanel: FC = () => {
  const instance = useReactFlow();
  const { flowId } = useParams();
  const { flow, updateFlow } = useFlow(flowId!);

  const onSave = useCallback((flowName?: string) => {
    const jsonObj = instance.toObject();
    const flowData = simplifyFlowData(jsonObj);

    updateFlow(
      {
        id: flow.id,
        name: flowName ?? flow.name,
        ...flowData,
      },
      async (state) => {
        console.log("save data: ", state);
        window.configFile.save(JSON.stringify(state));
        sessionStorage.setItem("editing-state", "false");
      }
    );
  }, []);

  const [executing, setExecuteState] = useState<boolean>(false);

  const handleTurnOnBot = useCallback(async () => {
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
  }, []);

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
  const { nodes } = obj;
  const simplifiedNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: node.data,
    position: node.position,
  }));
  return { ...obj, nodes: simplifiedNodes };
};
