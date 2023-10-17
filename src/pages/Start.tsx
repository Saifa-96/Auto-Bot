import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useVersion } from "../store";
import { Button } from "@radix-ui/themes";

export const Start: FC = () => {
  const navigate = useNavigate();
  const { set, init } = useVersion();

  const newProject = useCallback(() => {
    const flowId = init();
    navigate(`/editor/flow/${flowId}`);
  }, []);

  const openProject = useCallback(async () => {
    const result = await window.configFile.load();
    console.log('load project: ', result)
    const flowId = JSON.parse(result).flows[0].id;
    set(JSON.parse(result));
    navigate(`/editor/flow/${flowId}`);
  }, []);

  return (
    <section>
      <Button onClick={newProject}>New Project</Button>
      <Button onClick={openProject}>Open Project</Button>
    </section>
  );
};
