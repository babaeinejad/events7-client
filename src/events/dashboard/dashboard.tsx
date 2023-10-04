import { ActionBar } from "./actionbar/actionbar";
import { EventsGrid } from "events/dashboard/grid/grid";

export function Dashboard() {
  function createNewEvent() {}
  return (
    <div className="flex flex-col h-full w-full bg-white p-3">
      <div className="h-14 flex">
        <ActionBar handleCreateNewEvent={createNewEvent} />
      </div>
      <EventsGrid />
    </div>
  );
}
