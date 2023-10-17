import { FC, useCallback, useState } from "react";
import { Node } from "reactflow";
import { Text, Card, Flex, Button, Box, IconButton } from "@radix-ui/themes";
import { Cross1Icon, GearIcon } from "@radix-ui/react-icons";
import { v4 as uuid } from "uuid";
import { LoopSettings } from "../../core/nodes/loop";
import { CONDITIONAL_TYPE, Conditional, isOrConditional } from "../../core";
import { useUpdateNode, useEdgesManage } from "./hooks";
import { ConditionalDialog } from "../flow/ConditionalDialog";

const initConditional = (): Conditional => ({
  id: uuid(),
  type: CONDITIONAL_TYPE.IMAGE,
  targets: [],
  name: "new conditional",
});

export const LoopSettingsForm: FC<Node<LoopSettings>> = (node) => {
  const {
    data: { conditionals },
  } = node;

  const { update, produce } = useUpdateNode<LoopSettings>();

  const [newConditional, setNewConditional] = useState(initConditional);

  const handleAddConditional = useCallback(
    (conditional: Conditional) => {
      const newNode = produce(node, (draft) => {
        draft.data.conditionals.push(conditional);
      });
      update(newNode);
    },
    [node, update]
  );

  const handleUpdateConditional = useCallback(
    (conditional: Conditional) => {
      const newNode = produce(node, (draft) => {
        const index = draft.data.conditionals.findIndex((c) => {
          return !Array.isArray(c) && conditional.id === c.id;
        });
        draft.data.conditionals[index] = conditional;
      });

      update(newNode);
    },
    [node, update]
  );

  const { removeEdgeBySourceHandle } = useEdgesManage();
  const handleRemoveConditional = useCallback(
    (index: number) => {
      const sourceHandleId = node.data.conditionals[index].id!;
      const newNode = produce(node, (draft) => {
        draft.data.conditionals.splice(index, 1);
      });
      removeEdgeBySourceHandle(sourceHandleId);
      update(newNode);
    },
    [node, update]
  );

  return (
    <Flex direction="column" gap="2">
      <Text>Conditionals</Text>

      <ConditionalDialog data={newConditional} onSave={handleAddConditional}>
        <Button onClick={() => setNewConditional(initConditional())}>
          Add a conditional
        </Button>
      </ConditionalDialog>

      {conditionals.map((conditionalItem, index) => {
        if (isOrConditional(conditionalItem)) {
          // TODO or conditional
          return null;
        }
        return (
          <Card key={conditionalItem.id}>
            <Flex align="center" gap="2">
              <Box grow="1">
                <Text size="2">{conditionalItem.name}</Text>
              </Box>
              <ConditionalDialog
                data={conditionalItem}
                onSave={handleUpdateConditional}
              >
                <IconButton size="1" variant="ghost">
                  <GearIcon height="14" width="14" />
                </IconButton>
              </ConditionalDialog>
              <IconButton
                onClick={() => handleRemoveConditional(index)}
                size="1"
                variant="ghost"
              >
                <Cross1Icon height="14" width="14" />
              </IconButton>
            </Flex>
          </Card>
        );
      })}
    </Flex>
  );
};
