import { FC, DragEvent, HTMLProps, PropsWithRef, ReactElement } from "react";
import { Card, Flex, Box, Avatar, Text } from "@radix-ui/themes";
import {
  AspectRatioIcon,
  Crosshair1Icon,
  UpdateIcon,
} from "@radix-ui/react-icons";

import { NODE_TYPE } from "@/core";

interface NodeItem {
  type: NODE_TYPE;
  name: string;
  describe: string;
  icon: ReactElement;
}

const nodeList: NodeItem[] = [
  {
    type: NODE_TYPE.MATCH_CLICK,
    name: "Match Click Node",
    describe: "Matching and Clicking targets.",
    icon: <Crosshair1Icon />,
  },
  {
    type: NODE_TYPE.REGION_CLICK,
    name: "Region Click Node",
    describe: "Clicking targets in the region",
    icon: <AspectRatioIcon />,
  },
  {
    type: NODE_TYPE.LOOP,
    name: "Loop Node",
    describe: "Looping the node chain.",
    icon: <UpdateIcon />,
  },
];

export const FlowSettingsForm: FC = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
      <Text>Node List: </Text>
      <Flex mt="2" direction="column" gap="2">
        {nodeList.map(({ name, describe, type, icon }) => (
          <NodeCard
            key={name}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            name={name}
            describe={describe}
            icon={icon}
          />
        ))}
      </Flex>
    </div>
  );
};

interface NodeCardProps extends Omit<HTMLProps<HTMLDivElement>, "size"> {
  name: string;
  describe: string;
  icon: ReactElement;
}

const NodeCard: FC<PropsWithRef<NodeCardProps>> = (props) => {
  const { name, describe, icon, ...rest } = props;

  return (
    <Card asChild {...rest}>
      <a href="#" onClick={(e) => e.preventDefault()}>
        <Flex gap="3" align="center">
          <Avatar size="2" radius="full" fallback={icon} />
          <Box>
            <Text as="div" size="2" weight="bold">
              {name}
            </Text>
            <Text as="div" size="1" color="gray">
              {describe}
            </Text>
          </Box>
        </Flex>
      </a>
    </Card>
  );
};
