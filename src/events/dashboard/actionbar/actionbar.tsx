import Button from "@mui/material/Button";

interface IProps {
  handleCreateNewEvent: () => void;
}
export function ActionBar({ handleCreateNewEvent }: IProps) {
  return (
    <div className="flex w-full h-full items-center px-2">
      <Button
        className="h-9"
        variant="contained"
        color="secondary"
        onClick={handleCreateNewEvent}
        aria-label="Create New Event"
        data-testid="createEventButton"
      >
        Create New Event
      </Button>
    </div>
  );
}
