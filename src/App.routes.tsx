import { ReactNode } from "react";
import { createBrowserRouter, Link } from "react-router-dom";
import { Dashboard } from "events/dashboard/dashboard";

const RouteContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-full p-4 border-red-300 border bg-gray-200">
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
