import { FC, useCallback, useEffect, useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import { styled } from "styled-components";
import { PlusIcon } from "@radix-ui/react-icons";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { HorizonBox, HorizonBoxItem } from "../layouts";
import {
  useAddFlow,
  useFlowList,
  useMonitRegion,
  useUpdateMonitor,
} from "../store";
import {
  Button,
  ScrollArea,
  Separator,
  Text,
  Checkbox,
  Flex,
} from "@radix-ui/themes";
import { AddFlowDialog, SaveAlertDialog } from "../components";

export const Editor: FC = () => {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const flowList = useFlowList();
  const { addFlow } = useAddFlow();

  const region = useMonitRegion();

  const onValueChange = useCallback(
    (isShowMonitor: boolean) => {
      if (isShowMonitor) {
        window.monitor.open(region);
      } else {
        window.monitor.close();
      }
    },
    [region],
  );

  const updateMonitor = useUpdateMonitor();
  useEffect(() => {
    const off = window.monitor.onChangedGeometry((region) => {
      updateMonitor(region);
    });
    return () => {
      off();
    };
  }, [updateMonitor]);

  const alertDialogRef = useRef<{ alert: () => Promise<boolean> } | null>(null);

  const handleNavigateTo = useCallback(
    async (path: string) => {
      const state = sessionStorage.getItem("editing-state");
      if (state === "true") {
        const result = await alertDialogRef.current?.alert();
        if (!result) return;
      }

      sessionStorage.setItem("editing-state", "false");
      navigate(path);
    },
    [navigate],
  );

  // TODO asking whether close window when the flow data hasn't saved.
  const handleAddFlow = useCallback(
    (name: string) => {
      const flow = addFlow(name);
      handleNavigateTo("/editor/flow/" + flow.id);
    },
    [addFlow, handleNavigateTo],
  );

  return (
    <ReactFlowProvider>
      <HorizonBox>
        <HorizonBoxItem
          width={150}
          style={{
            borderRight: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1 }}>
            <ScrollArea scrollbars="vertical">
              <Sidebar>
                {flowList.map((flow) => (
                  <Button
                    color={flowId === flow.id ? "orange" : undefined}
                    key={flow.id}
                    onClick={() => handleNavigateTo("/editor/flow/" + flow.id)}
                  >
                    {flow.name}
                  </Button>
                ))}
                <AddFlowDialog onSave={handleAddFlow}>
                  <Button>
                    <PlusIcon />
                    Add Flow
                  </Button>
                </AddFlowDialog>
              </Sidebar>
            </ScrollArea>
          </div>

          <Separator my="2" size="4" />

          <Button m="2" onClick={() => handleNavigateTo("/editor/images")}>
            Images
          </Button>
          <Text m="2" as="label" size="2">
            <Flex gap="2">
              <Checkbox onCheckedChange={onValueChange} /> Monitor
            </Flex>
          </Text>
        </HorizonBoxItem>

        <Outlet />
      </HorizonBox>

      <SaveAlertDialog ref={alertDialogRef} />
    </ReactFlowProvider>
  );
};

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;
