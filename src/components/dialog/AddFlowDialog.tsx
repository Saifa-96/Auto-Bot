import {
  ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";

interface AddFlowDialog {
  onSave: (flowName: string) => void;
  children?: ReactElement;
}

export const AddFlowDialog = forwardRef<{ show: () => void }, AddFlowDialog>(
  (props, ref) => {
    const { onSave, children } = props;
    const [open, setOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        show: () => setOpen(true),
      }),
      [],
    );

    useEffect(() => {
      if (!open && inputRef.current) {
        inputRef.current.value = "";
      }
    }, [open]);

    const handleSave = useCallback(() => {
      onSave(inputRef.current!.value);
    }, [onSave]);

    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children && <Dialog.Trigger>{children}</Dialog.Trigger>}
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Add New Flow</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Please, Enter the flow's name.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Input
                ref={inputRef}
                placeholder="Enter the flow's name"
              />
            </label>
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
  },
);
