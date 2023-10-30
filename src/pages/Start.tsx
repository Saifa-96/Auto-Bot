import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex } from "@radix-ui/themes";
import { FilePlusIcon, FileTextIcon } from "@radix-ui/react-icons";
import { styled } from "styled-components";
import { useVersion } from "../store";

export const Start: FC = () => {
  const navigate = useNavigate();
  const { set, init } = useVersion();

  const newProject = useCallback(() => {
    const flowId = init();
    window.geometry.resize(1100, 700);
    setTimeout(() => navigate(`/editor/flow/${flowId}`), 0);
  }, []);

  const openProject = useCallback(async () => {
    const result = await window.configFile.load();
    const flowId = JSON.parse(result).flows[0].id;
    set(JSON.parse(result));
    window.geometry.resize(1100, 700);
    setTimeout(() => navigate(`/editor/flow/${flowId}`), 0);
  }, []);

  return (
    <StyledSection>
      <Flex justify="between">
        <Button onClick={newProject}>
          <FilePlusIcon />
          New Project
        </Button>
        <Button onClick={openProject}>
          <FileTextIcon />
          Open Project
        </Button>
      </Flex>
    </StyledSection>
  );
};

const StyledSection = styled.section`
  padding: 10px;
`;
