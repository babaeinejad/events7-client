import { ICellRendererParams } from "ag-grid-community";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
export default function EventActionsCellRenderer(params: ICellRendererParams) {
  const { handleEditEvent, handleDeleteEvent } =
    params?.colDef?.cellRendererParams ?? undefined;
  return (
    <div className="flex justify-between items-center">
      <IconButton aria-label="edit the event" onClick={handleEditEvent}>
        <EditIcon className="text-gray-700" />
      </IconButton>
      <IconButton aria-label="delete the event" onClick={handleDeleteEvent}>
        <DeleteIcon className="text-red-700" />
      </IconButton>
    </div>
  );
}
