import { styled, css } from "styled-components";
import { borderWithShadow } from "@lib/styles";
import { Sizes } from "@lib/types";

const sm = css`
  height: 30px;
  font-size: 13px;
  font-weight: 600;
`;

const md = css`
  height: 40px;
  font-size: 17px;
  font-weight: 600;
`;

export const Button = styled.button<{ size?: Sizes }>`
  ${(props) => {
    switch (props.size) {
      case "sm":
        return sm;
      default:
        return md;
    }
  }}

  ${borderWithShadow}

  background-color: var(--bg-color);
  color: var(--font-color);
  cursor: pointer;

  &:enabled:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
  }

  &:disabled {
    background-color: var(--bg-disabled-color);
    color: var(--font-color-sub);
    cursor: not-allowed;
  }
`;
