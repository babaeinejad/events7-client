import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import EventActionsCellRenderer from "events/dashboard/grid/cell-renderers/eventActionsCellRenderer";
import useAxios from "axios-hooks";
import { eventsUrl } from "events/dashboard/consts";
import { useEffect, useRef } from "react";
import EventPriorityCellRenderer from "events/dashboard/grid/cell-renderers/eventPriorityCellRenderer";

export function EventsGrid() {
  const gridRef = useRef<AgGridReact | null>(null);

  const [{ data: events, loading }] = useAxios(eventsUrl);
  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.hideOverlay();
      if (loading) {
        gridRef?.current?.api.showLoadingOverlay();
      }
    }
  }, [loading]);
  function handleDeleteEvent() {}
  function handleEditEvent() {}
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

  function autoSizeColumns() {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.sizeColumnsToFit();
    }
  }

  return (
    <div className="ag-theme-alpine p-2 flex  h-[calc(100%-36px)] ">
      <AgGridReact
        ref={gridRef}
        className="w-full h-full"
        rowData={events}
        columnDefs={columnDef}
        defaultColDef={{ sortable: true }}
        onGridReady={autoSizeColumns}
      />
    </div>
  );
}
