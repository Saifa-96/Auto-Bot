import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Theme } from "@radix-ui/themes";

import { Start, Editor, Screenshot, Monitor } from "./pages";
import { FlowPanel, ImageStore } from "./components";

import "./App.css";
import "./radix-ui.css";
import "react-toastify/dist/ReactToastify.css";

const router = createHashRouter([
  {
    path: "/",
    element: <Start />,
  },
  {
    path: "editor",
    element: <Editor />,
    children: [
      {
        path: "flow/:flowId",
        element: <FlowPanel />,
      },
      {
        path: "images",
        element: <ImageStore />,
      },
    ],
  },
  {
    path: "screenshot",
    element: <Screenshot />,
  },
  {
    path: "monitor",
    element: <Monitor />,
  },
]);

export default function App() {
  return (
    <Theme hasBackground={false}>
      <RouterProvider router={router} />
    </Theme>
  );
}
