import { fireEvent, render } from "@testing-library/react";
import { Button } from "@lib/index";

describe("<Button />", () => {
  it("should render button", () => {
    const { getByRole } = render(<Button />);
    const button = getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("should render children", () => {
    const { getByRole } = render(<Button>Button</Button>);
    const button = getByRole("button");
    expect(button.innerHTML).toBe("Button");
  });

  it("should handle different types", () => {
    const { getByRole } = render(<Button type="submit" />);
    const button = getByRole("button");

    expect(button).toHaveAttribute("type", "submit");
  });

  it("should handle click properly", () => {
    const onButtonClick = jest.fn();
    const { getByRole } = render(<Button onClick={onButtonClick} />);
    const button = getByRole("button");
    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalled();
  });

  it("should handle button sizes properly", () => {
    const { getByRole, rerender } = render(<Button type="submit" />);
    const mdButton = getByRole("button");

    expect(mdButton).toHaveStyleRule("height", "40px");

    rerender(<Button size="sm" />);
    const smButton = getByRole("button");
    expect(smButton).toHaveStyleRule("height", "30px");
  });

  it("could be disabled", () => {
    const onBtnClick = jest.fn();
    const { getByRole } = render(<Button disabled onClick={onBtnClick} />);
    const button = getByRole("button");
    expect(button).toHaveAttribute("disabled");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onBtnClick).not.toHaveBeenCalled();
  });
});
