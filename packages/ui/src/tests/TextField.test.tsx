import { createRef } from "react";
import { fireEvent, render } from "@testing-library/react";
import { TextFiled } from "@lib/index";

describe("<Input />", () => {
  it("should render input", () => {
    const { getByRole } = render(<TextFiled />);
    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("could be disabled", () => {
    const onFocus = jest.fn();
    const { getByRole } = render(<TextFiled disabled onFocus={onFocus} />);
    const input = getByRole("textbox");
    expect(input).toBeDisabled();

    fireEvent.click(input);
    expect(onFocus).not.toHaveBeenCalled();
  });

  it("should forwardRef to native input", () => {
    const ref = createRef<HTMLInputElement>();
    const { getByRole } = render(<TextFiled ref={ref} />);
    const input = getByRole("textbox");
    expect(ref.current).toBe(input);
  });

  it("should handle onValueChange", () => {
    const onFocus = jest.fn();
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <TextFiled onFocus={onFocus} onValueChange={onValueChange} />
    );
    const input = getByRole("textbox") as HTMLInputElement;

    input.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: "a" } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("a");
  });
});
