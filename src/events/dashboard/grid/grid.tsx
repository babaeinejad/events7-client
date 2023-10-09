import { AgGridReact } from "ag-grid-react";
import {
  deleteConfirmationMessage,
  EventsUrl,
  getRowClassRules,
  getRowId,
  GRID_COLUMN_DEF,
} from "events/dashboard/consts";
import { useEffect, useRef, useState, useContext } from "react";
import { Confirmation } from "shared-components/confirmation";
import { EventFormDialog } from "events/dashboard/create-edit-event/createEditEvent";
import {
  Event7FormType,
  Event7FormTypeWithId,
} from "events/dashboard/create-edit-event/formSchema";
import { ActionBar } from "../actionbar/actionbar";
import classNames from "classnames";
import { Alert, AlertTitle, Button, useTheme } from "@mui/material";
import axios from "axios";
import { hasIdProperty } from "events/types";
import {
  EventsContext,
  EventsContextType,
} from "events/context/events-context";

export function EventsGrid() {
  const theme = useTheme();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEventFormDialog, setOpenEventFormDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    Event7FormType | Event7FormTypeWithId | null
  >(null);
  const [error, setError] = useState("");
  const gridRef = useRef<AgGridReact | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    deleteEvent,
    createEvent,
    updateEvent,
    error: fetchNextPageError,
    loading: fetchNextPageLoading,
    lastPage,
    currentPage,
    currentPageData,
    goToNextPage,
    goToPreviousPage,
  } = useContext(EventsContext) as EventsContextType;
  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.hideOverlay();
      if (loading || fetchNextPageLoading) {
        gridRef?.current?.api.showLoadingOverlay();
      }
    }
  }, [loading, fetchNextPageLoading, gridRef]);

  function handleDeleteEvent(event: Event7FormType) {
    setSelectedEvent(event);
    openConfirmationDialog();
  }

  function handleEditEvent(event: Event7FormType) {
    setSelectedEvent(event);
    setOpenEventFormDialog(true);
  }

  function handleCreateEvent() {
    setOpenEventFormDialog(true);
  }

  const columnDef = GRID_COLUMN_DEF(handleEditEvent, handleDeleteEvent);

  function autoSizeColumns() {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.sizeColumnsToFit();
    }
  }

  function handleDelete() {
    if (selectedEvent && hasIdProperty(selectedEvent)) {
      setLoading(true);
      axios({
        data: selectedEvent,
        url: EventsUrl + selectedEvent.id,
        method: "DELETE",
      })
        .then((result) => {
          setError("");
          setSelectedEvent(null);
          deleteEvent(result.data, currentPage);
          if (gridRef?.current?.api && result?.data?.id) {
            const item = gridRef?.current?.api.getRowNode(result.data.id);
            if (item) {
              gridRef.current.api.applyTransaction({ remove: [item.data] });
            }
          }
        })
        .catch((err) => {
          setError(err?.response?.data?.message || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function openConfirmationDialog() {
    setOpenConfirmation(true);
  }

  function closeConfirmationDialog() {
    setOpenConfirmation(false);
  }

  function onEditted(item: Event7FormTypeWithId) {
    setOpenEventFormDialog(false);
    if (item && gridRef?.current?.api) {
      setSelectedEvent(null);
      updateEvent(item, currentPage);
      gridRef.current.api.applyTransaction({ update: [item] });
    }
  }

  function onCreated(item: Event7FormType) {
    setOpenEventFormDialog(false);
    if (item && gridRef?.current?.api) {
      setSelectedEvent(null);
      createEvent(item);
      gridRef.current.api.applyTransaction({ add: [item] });
      const newIndex = gridRef.current.api.getDisplayedRowCount() - 1;
      gridRef.current.api.ensureIndexVisible(newIndex, "bottom");
    }
  }

  function handleCloseEventFormDialog() {
    setOpenEventFormDialog(false);
    setSelectedEvent(null);
  }

  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef.current.api.redrawRows();
    }
  }, [theme.palette.mode]);

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
        {(error || fetchNextPageError) && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error ? error : fetchNextPageError}
          </Alert>
        )}
        <AgGridReact
          ref={gridRef}
          className="w-full h-full"
          rowData={currentPageData}
          columnDefs={columnDef}
          defaultColDef={{ sortable: false }}
          onGridReady={autoSizeColumns}
          getRowId={getRowId}
          animateRows
          enableCellChangeFlash
          rowClassRules={getRowClassRules(theme.palette.mode)}
          pagination
          suppressPaginationPanel
        />
        <div className="flex h-12 justify-between items-center">
          <Button
            variant="outlined"
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            aria-label="Previous"
          >
            Previous page
          </Button>
          <Button
            variant="outlined"
            onClick={goToNextPage}
            autoFocus
            aria-label="Next"
            disabled={lastPage !== 0 && lastPage === currentPage}
          >
            Next page
          </Button>
        </div>
      </div>
    </>
  );
}
