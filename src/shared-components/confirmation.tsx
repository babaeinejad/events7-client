import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
  open: boolean;
  title?: string;
  message: string;
  onClosed: () => void;
  onConfirmed: () => void;
  onCancelled: () => void;
}
export function Confirmation({
  message,
  title,
  open,
  onClosed,
  onConfirmed,
  onCancelled,
}: IProps) {
  function handleClose() {
    onClosed();
  }

  function handleConfirm() {
    onConfirmed();
    handleClose();
  }

  function handleCalcelled() {
    onCancelled();
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title ?? "Are you sure?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Confirm</Button>
        <Button onClick={handleCalcelled} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
