import { AgGridReact } from "ag-grid-react";
import { ColDef, GetRowIdParams } from "ag-grid-community";
import EventActionsCellRenderer from "events/dashboard/grid/cell-renderers/eventActionsCellRenderer";
import useAxios from "axios-hooks";
import { deleteConfirmationMessage, eventsUrl } from "events/dashboard/consts";
import { useEffect, useRef, useState } from "react";
import EventPriorityCellRenderer from "events/dashboard/grid/cell-renderers/eventPriorityCellRenderer";
import { Confirmation } from "shared-components/confirmation";
import { Events7 } from "events/types";

export function EventsGrid() {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events7 | null>(null);
  const gridRef = useRef<AgGridReact | null>(null);
  const [{ data: events, loading }] = useAxios(eventsUrl);
  const [{ data: deleteResult, loading: deleteLoading }, executeDelete] =
    useAxios(
      { method: "DELETE" },
      {
        manual: true,
      }
    );

  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.hideOverlay();
      if (loading || deleteLoading) {
        gridRef?.current?.api.showLoadingOverlay();
      }
    }
  }, [loading, deleteLoading]);

  useEffect(() => {
    if (gridRef?.current?.api && deleteResult?.id) {
      // const selectedRowData = gridRef?.current?.api.getSelectedRows();

      const item = gridRef?.current?.api.getRowNode(deleteResult.id);
      if (item) {
        gridRef.current.api.applyTransaction({ remove: [item.data] });
      }
    }
  }, [deleteResult]);

  function handleDeleteEvent(event: Events7) {
    setSelectedEvent(event);
    openConfirmationDialog();
  }

  function handleEditEvent(event: Events7) {
    setSelectedEvent(event);
  }

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

  const getRowId = (params: GetRowIdParams) => params.data.id;

  function autoSizeColumns() {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.sizeColumnsToFit();
    }
  }

  function handleDelete() {
    if (selectedEvent) {
      executeDelete({ data: selectedEvent, url: eventsUrl + selectedEvent.id });
    }
  }

  function openConfirmationDialog() {
    setOpenConfirmation(true);
  }
  function closeConfirmationDialog() {
    setOpenConfirmation(false);
  }

  return (
    <>
      <Confirmation
        onClosed={closeConfirmationDialog}
        message={deleteConfirmationMessage}
        onCancelled={closeConfirmationDialog}
        onConfirmed={handleDelete}
        open={openConfirmation}
        title="Delete Event"
      />

      <div className="ag-theme-alpine p-2 flex  h-[calc(100%-36px)] ">
        <AgGridReact
          ref={gridRef}
          className="w-full h-full"
          rowData={events}
          columnDefs={columnDef}
          defaultColDef={{ sortable: true }}
          onGridReady={autoSizeColumns}
          getRowId={getRowId}
          animateRows
        />
      </div>
    </>
  );
}
