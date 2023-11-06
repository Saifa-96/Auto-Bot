import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";

export const SaveAlertDialog = forwardRef<
  { alert: () => Promise<boolean> },
  object
>((_props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const resolveFn = useRef<((v: boolean) => void) | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      alert: () => {
        setOpen(true);
        return new Promise((resolve) => (resolveFn.current = resolve));
      },
    }),
    [],
  );

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Leave current flow editor</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This flow has been edited but hasn't been saved. Leaving
          this flow will result in losing all the data you've changed."
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="gray"
              onClick={() => {
                resolveFn.current?.(false);
                resolveFn.current = null;
              }}
            >
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              onClick={() => {
                resolveFn.current?.(true);
                resolveFn.current = null;
              }}
            >
              OK
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
});
