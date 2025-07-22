import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/layout/Home";
import { Root } from "./components/layout/Root";
import Tasks from "./components/Task/Tasks";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement:<p>ERROR</p>,
      children: [
        { path: "/", element: <Home /> },
        { path: "/task", element: <Tasks /> },
      ],
    },
  ]);
  return <RouterProvider router={router}/>;
}

export default App;
