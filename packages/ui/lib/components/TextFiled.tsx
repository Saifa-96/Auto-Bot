import { styled } from "styled-components";
import { borderWithShadow } from "@lib/styles";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  ChangeEventHandler,
} from "react";

const Wrapper = styled.div<{ disabled?: boolean }>`
  width: 200px;
  height: 40px;
  ${borderWithShadow}

  padding: 5px 10px;
  box-sizing: border-box;
  /* background-color: var(--bg-color); */
  background-color: var(
    ${(props) => (props.disabled ? "--bg-disabled-color" : "--bg-color")}
  );

  &:focus-within {
    border: 2px solid var(--focus-color);
  }

  /* &.disabled {
    background-color: var(--bg-disabled-color);
  } */
`;

const Input = styled.input`
  width: 100%;
  height: 100%;

  /* font style */
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  outline: none;
  box-sizing: border-box;
  border: none;

  &::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }
`;

interface TextFiledProps extends ComponentPropsWithoutRef<"input"> {
  onValueChange?: (value: string) => void;
}

export const TextFiled = forwardRef<HTMLInputElement, TextFiledProps>(
  (props, forwardedRef) => {
    const { onValueChange, onChange, disabled, ...rest } = props;

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const value = e.currentTarget.value;
      onValueChange?.(value);
      onChange?.(e);
    };

    return (
      <Wrapper disabled={disabled}>
        <Input
          ref={forwardedRef}
          disabled={disabled}
          spellCheck="false"
          onChange={handleChange}
          {...rest}
        />
      </Wrapper>
    );
  }
);
