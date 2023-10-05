import { AgGridReact } from "ag-grid-react";
import { ColDef, GetRowIdParams } from "ag-grid-community";
import EventActionsCellRenderer from "events/dashboard/grid/cell-renderers/eventActionsCellRenderer";
import useAxios from "axios-hooks";
import { deleteConfirmationMessage, EventsUrl } from "events/dashboard/consts";
import { useEffect, useRef, useState } from "react";
import EventPriorityCellRenderer from "events/dashboard/grid/cell-renderers/eventPriorityCellRenderer";
import { Confirmation } from "shared-components/confirmation";
import { EventFormDialog } from "events/dashboard/create-edit-event/createEditEvent";
import { Event7FormType } from "events/dashboard/create-edit-event/formSchema";
import { ActionBar } from "../actionbar/actionbar";
import classNames from "classnames";
import { Alert, AlertTitle, useTheme } from "@mui/material";

export function EventsGrid() {
  const theme = useTheme();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEventFormDialog, setOpenEventFormDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event7FormType | null>(
    null
  );
  const [error, setError] = useState("");
  const gridRef = useRef<AgGridReact | null>(null);
  const [{ data: events, loading, error: eventsError }] = useAxios(EventsUrl);
  const [{ loading: deleteLoading }, executeDelete] = useAxios(
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

  function handleDeleteEvent(event: Event7FormType) {
    setSelectedEvent(event);
    openConfirmationDialog();
  }

  function handleEditEvent(event: Event7FormType) {
    setSelectedEvent(event);
    setOpenEventFormDialog(true);
  }

  function handleCreateEvent() {
    setSelectedEvent(null);
    setOpenEventFormDialog(true);
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
      executeDelete({ data: selectedEvent, url: EventsUrl + selectedEvent.id })
        .then((result) => {
          setError("");
          if (gridRef?.current?.api && result?.data?.id) {
            const item = gridRef?.current?.api.getRowNode(result.data.id);
            if (item) {
              gridRef.current.api.applyTransaction({ remove: [item.data] });
            }
          }
        })
        .catch((err) => {
          setError(err?.response?.data?.message || err.message);
        });
    }
  }

  function openConfirmationDialog() {
    setOpenConfirmation(true);
  }

  function closeConfirmationDialog() {
    setOpenConfirmation(false);
  }

  function onEditted(item: Event7FormType) {
    setOpenEventFormDialog(false);
    if (item && gridRef?.current?.api) {
      gridRef.current.api.applyTransaction({ update: [item] });
    }
  }

  function onCreated(item: Event7FormType) {
    setOpenEventFormDialog(false);
    if (item && gridRef?.current?.api) {
      gridRef.current.api.applyTransaction({ add: [item] });
      const newIndex = gridRef.current.api.getDisplayedRowCount() - 1;
      gridRef.current.api.ensureIndexVisible(newIndex, "bottom");
    }
  }

  function handleCloseEventFormDialog() {
    setOpenEventFormDialog(false);
  }

  return (
    <>
      <div className="h-14 flex">
        <ActionBar handleCreateNewEvent={handleCreateEvent} />
      </div>
      <Confirmation
        onClosed={closeConfirmationDialog}
        message={deleteConfirmationMessage}
        onCancelled={closeConfirmationDialog}
        onConfirmed={handleDelete}
        open={openConfirmation}
        title="Delete Event"
      />

      <EventFormDialog
        open={openEventFormDialog}
        itemEditted={onEditted}
        itemCreated={onCreated}
        data={selectedEvent!}
        handleClose={handleCloseEventFormDialog}
      />

      <div
        className={classNames(
          "ag-theme-alpine p-2 flex flex-col  h-[calc(100%-36px)]",
          {
            "ag-theme-alpine-dark": theme.palette.mode === "dark",
            "ag-theme-alpine": theme.palette.mode === "light",
          }
        )}
      >
        {(error || eventsError?.message) && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error ? error : eventsError?.message}
          </Alert>
        )}
        <AgGridReact
          ref={gridRef}
          className="w-full h-full"
          rowData={events}
          columnDefs={columnDef}
          defaultColDef={{ sortable: true }}
          onGridReady={autoSizeColumns}
          getRowId={getRowId}
          animateRows
          enableCellChangeFlash
        />
      </div>
    </>
  );
}
