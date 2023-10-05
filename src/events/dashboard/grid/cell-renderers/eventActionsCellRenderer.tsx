import { ICellRendererParams } from "ag-grid-community";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

export default function EventActionsCellRenderer(params: ICellRendererParams) {
  const { onEditClicked, onDeleteClicked } =
    params?.colDef?.cellRendererParams ?? undefined;

  return (
    <div className="flex justify-between items-center">
      <IconButton
        aria-label="edit the event"
        onClick={() => onEditClicked(params.data)}
      >
        <EditIcon className="text-gray-700" />
      </IconButton>
      <IconButton
        aria-label="delete the event"
        onClick={() => onDeleteClicked(params.data)}
      >
        <DeleteIcon className="text-red-700" />
      </IconButton>
    </div>
  );
}
