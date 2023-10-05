import { useTheme } from "@mui/material";
import classNames from "classnames";
import { EventsGrid } from "events/dashboard/grid/grid";

export function Dashboard() {
  const theme = useTheme();
  return (
    <div
      className={classNames("flex flex-col h-full w-full p-3 bg-white", {
        "bg-dark-900": theme.palette.mode === "dark",
      })}
    >
      <EventsGrid />
    </div>
  );
}
