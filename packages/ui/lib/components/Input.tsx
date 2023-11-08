import { styled } from 'styled-components'

export const Input = styled.input`
  width: 200px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  &:focus {
    border: 2px solid var(--focus-color);
  }
`