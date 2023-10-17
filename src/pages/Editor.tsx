import { FC, useCallback } from "react";
import { ReactFlowProvider } from "reactflow";
import { styled } from "@stitches/react";
import { Outlet, useNavigate } from "react-router-dom";
import { HorizonBox, HorizonBoxItem } from "../layouts";
import { useFlowList, useMonitRegion } from "../store";
import {
  Button,
  ScrollArea,
  Separator,
  Text,
  Checkbox,
  Flex,
} from "@radix-ui/themes";

export const Editor: FC = () => {
  const navigate = useNavigate();
  const flowList = useFlowList();

  const region = useMonitRegion();
  const onValueChange = useCallback(
    (isShowMonitor: boolean) => {
      if (isShowMonitor) {
        console.log("monitor area: ", region);
        // window.screenshot.showMonitor(area);
        window.monitor.open(region);
      } else {
        // window.screenshot.hideMonitor();
        window.monitor.close();
      }
    },
    [region]
  );

  return (
    <ReactFlowProvider>
      <HorizonBox>
        <HorizonBoxItem
          width={150}
          css={{
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
                    key={flow.id}
                    onClick={() => navigate("/editor/flow/" + flow.id)}
                  >
                    {flow.name}
                  </Button>
                ))}
              </Sidebar>
            </ScrollArea>
          </div>
          <Separator my="2" size="4" />
          <Button m="2" onClick={() => navigate("/editor/images")}>
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
    </ReactFlowProvider>
  );
};

const Sidebar = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: 10,
  background: "Yellow",
});
