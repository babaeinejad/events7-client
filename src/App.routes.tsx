import { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "events/dashboard/dashboard";
import { useTheme } from "@mui/material";
import classnames from "classnames";

const RouteContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <div
      className={classnames("flex w-full h-full p-4", {
        "bg-light-200": theme.palette.mode === "light",
        "bg-dark-800": theme.palette.mode === "dark",
      })}
    >
      {children}
    </div>
  );
};
export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteContainer>
        <Dashboard />
      </RouteContainer>
    ),
  },
]);
