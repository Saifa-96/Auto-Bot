import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex } from "@radix-ui/themes";
import { FilePlusIcon, FileTextIcon } from "@radix-ui/react-icons";
import { useVersion } from "../store";

export const Start: FC = () => {
  const navigate = useNavigate();
  const { set, init } = useVersion();

  const newProject = useCallback(() => {
    const flowId = init();
    window.geometry.resize(1100, 700);
    setTimeout(() => navigate(`/editor/flow/${flowId}`), 0);
  }, [init, navigate]);

  const openProject = useCallback(async () => {
    const result = await window.configFile.load();
    const flowId = JSON.parse(result).flows[0].id;
    set(JSON.parse(result));
    window.geometry.resize(1100, 700);
    setTimeout(() => navigate(`/editor/flow/${flowId}`), 0);
  }, [navigate, set]);

  return (
    <Box asChild p="2">
      <section>
        <Flex direction="column" gap="2">
          <Button onClick={newProject} color="bronze">
            <FilePlusIcon />
            New Project
          </Button>
          <Button onClick={openProject}>
            <FileTextIcon />
            Open Project
          </Button>
        </Flex>
      </section>
    </Box>
  );
};
