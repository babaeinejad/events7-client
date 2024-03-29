import { useTheme } from "@mui/material";
import classNames from "classnames";
import EventsProvider from "events/context/events-provider";
import { EventsGrid } from "events/dashboard/grid/grid";

export function Dashboard() {
  const theme = useTheme();
  return (
    <div
      className={classNames("flex flex-col h-full w-full p-", {
        "bg-white": theme.palette.mode === "light",
        "bg-dark-900": theme.palette.mode === "dark",
      })}
    >
      <EventsProvider>
        <EventsGrid />
      </EventsProvider>
    </div>
  );
}
