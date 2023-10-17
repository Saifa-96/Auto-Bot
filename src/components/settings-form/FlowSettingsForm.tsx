import { FC, DragEvent } from "react";
import { useParams } from "react-router-dom";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { useFlow } from "../../store";
import { NODE_TYPE } from "../../core";

export const FlowSettingsForm: FC = () => {
  const { flowId } = useParams();
  const { flow } = useFlow(flowId!);
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
      <Button mb="3" onClick={() => window.screenshot.turnOnBot(flow.id)}>
        Execute
      </Button>
      <TextFieldInput readOnly value={flow.name} />
      <ul>
        <li
          draggable
          onDragStart={(event) => onDragStart(event, NODE_TYPE.REGION_CLICK)}
        >
          region click
        </li>
        <li
          draggable
          onDragStart={(event) => onDragStart(event, NODE_TYPE.MATCH_CLICK)}
        >
          match click
        </li>
        <li
          draggable
          onDragStart={(event) => onDragStart(event, NODE_TYPE.LOOP)}
        >
          loop
        </li>
      </ul>
    </div>
  );
};
