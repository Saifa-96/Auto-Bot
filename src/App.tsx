import { createHashRouter, RouterProvider } from "react-router-dom";
import { Start, Editor, Screenshot, Monitor } from "./pages";
import { FlowPanel } from "./components";

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
        element: <div>images store</div>,
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
