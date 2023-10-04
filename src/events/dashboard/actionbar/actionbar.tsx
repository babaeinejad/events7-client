import Button from "@mui/material/Button";

interface IProps {
  handleCreateNewEvent: () => void;
}
export function ActionBar({ handleCreateNewEvent }: IProps) {
  return (
    <div className="flex w-full h-9 p-2">
      <Button className="h-9" variant="outlined" onClick={handleCreateNewEvent}>
        Create New Event
      </Button>
    </div>
  );
}
