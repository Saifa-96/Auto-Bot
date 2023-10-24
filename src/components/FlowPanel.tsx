import { FC } from "react";
import { ScrollArea } from "@radix-ui/themes";
import { HorizonBoxItem } from "../layouts";
import { Flow } from "./flow/Flow";
import { SettingsForm } from "./settings-form/SettingsForm";

export const FlowPanel: FC = () => {
  return (
    <>
      <HorizonBoxItem width="stretch">
        <Flow />
      </HorizonBoxItem>

      <HorizonBoxItem width={300} style={{ borderLeft: "1px solid #ccc" }}>
        <ScrollArea scrollbars="vertical">
          <div style={{ padding: 10 }}>
            <SettingsForm />
          </div>
        </ScrollArea>
      </HorizonBoxItem>
    </>
  );
};
