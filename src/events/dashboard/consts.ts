import { ColDef, GetRowIdParams, RowClassRules } from "ag-grid-community";
import EventActionsCellRenderer from "events/dashboard/grid/cell-renderers/eventActionsCellRenderer";
import EventPriorityCellRenderer from "events/dashboard/grid/cell-renderers/eventPriorityCellRenderer";
import { Event7FormType } from "./create-edit-event/formSchema";

export const EventsUrl = import.meta.env.VITE_BASE_URL + "/events/";
export const deleteConfirmationMessage =
  "Are you sure you want to delete this event?";
export const HIGH_PRIORITY = 7;
export const PAGE_SIZE = 50;

export const GRID_COLUMN_DEF = (
  handleEditEvent: (event: Event7FormType) => void,
  handleDeleteEvent: (event: Event7FormType) => void
) => {
  const columnDef: ColDef[] = [
    { field: "id", width: 100, headerName: "ID" },
    { field: "name", width: 120, headerName: "Event Name" },
    { field: "type", width: 150, headerName: "Type" },
    {
      field: "priority",
      width: 100,
      headerName: "Priority",
      cellRenderer: EventPriorityCellRenderer,
    },
    {
      field: "description",

      headerName: "Description",
      flex: 2,
    },
    {
      headerName: "Actions",
      cellRenderer: EventActionsCellRenderer,
      cellRendererParams: {
        onEditClicked: handleEditEvent,
        onDeleteClicked: handleDeleteEvent,
      },
      width: 120,
      sortable: false,
      pinned: "right",
    },
  ];
  return columnDef;
};

export const getRowId = (params: GetRowIdParams) => params.data.id;

export const getRowClassRules: (
  palleteMode: "light" | "dark"
) => RowClassRules<Event7FormType> = (paletteMode) => ({
  "red-rows": (params) =>
    (params?.data?.priority || 1) > HIGH_PRIORITY && paletteMode === "light",
  "dark-red-rows": (params) =>
    (params?.data?.priority || 1) > HIGH_PRIORITY && paletteMode === "dark",
});
