import { styled } from "styled-components";

export const Button = styled.button`
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;

  &:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
  }
`;
