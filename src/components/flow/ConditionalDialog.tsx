import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { Conditional, TemplateItem } from "../../core";
import { TemplatesInput } from "../settings-form/fields";

interface ConditionalDialogProps {
  data: Conditional;
  onSave: (data: Conditional) => void;
}

export const ConditionalDialog: FC<
  PropsWithChildren<ConditionalDialogProps>
> = (props) => {
  const { children, data, onSave } = props;

  const [value, setValue] = useState<TemplateItem[]>([]);
  const [nameValue, setNameValue] = useState("");

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (open) {
      setValue(data.targets);
      setNameValue(data.name);
    }
  }, [open, data]);

  const handleSave = useCallback(() => {
    onSave({ ...data, targets: value, name: nameValue });
  }, [value, nameValue]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit Conditional</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to this conditional.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Input
              //   ref={inputRef}
              value={nameValue}
              placeholder="Enter the conditional's name"
              onChange={(e) => setNameValue(e.target.value)}
            />
          </label>
          <div>
            <Text as="div" size="2" mb="1" weight="bold">
              Targets
            </Text>
            <TemplatesInput value={value} onChange={setValue} />
          </div>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSave}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
