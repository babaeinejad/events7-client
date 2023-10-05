import { EventsGrid } from "events/dashboard/grid/grid";

export function Dashboard() {
  return (
    <div className="flex flex-col h-full w-full bg-white p-3">
      <EventsGrid />
    </div>
  );
}
