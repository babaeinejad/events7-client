import { createBrowserRouter, Link } from "react-router-dom";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1 className="text-3xl text-red-500 font-bold underline">
          Hello World
        </h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);
