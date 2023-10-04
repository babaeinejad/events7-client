import { ActionBar } from "./actionbar/actionbar";

export function Dashboard() {
  function createNewEvent() {}
  return (
    <div className="flex h-full w-full bg-white p-3">
      <ActionBar handleCreateNewEvent={createNewEvent} />
    </div>
  );
}
