import { GlobalStyles } from "@lib/styles";
import type { FC, PropsWithChildren } from "react";

export const renderWithTheme: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <GlobalStyles />
      {children}
    </div>
  );
};
