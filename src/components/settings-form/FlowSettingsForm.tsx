import { FC, DragEvent } from "react";
import { NODE_TYPE } from "../../core";

export const FlowSettingsForm: FC = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
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
