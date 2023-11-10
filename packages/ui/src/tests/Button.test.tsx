import { render, screen } from "@testing-library/react";
import { Button, GlobalStyles } from "../../lib";
import type { FC, PropsWithChildren } from "react";
// import "@testing-library/jest-dom";

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <GlobalStyles />
      {children}
    </div>
  );
};

test("Check Button", () => {
  render(<Button>Button</Button>, { wrapper: Wrapper });

  const btnElement = screen.getByText("Button");

  expect(btnElement).toBeInTheDocument();
  expect(btnElement).toHaveStyleRule('border', '2px solid var(--main-color)')
});
