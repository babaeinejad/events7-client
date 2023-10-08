import { AgGridReact } from "ag-grid-react";
import { ColDef, GetRowIdParams, RowClassRules } from "ag-grid-community";
import EventActionsCellRenderer from "events/dashboard/grid/cell-renderers/eventActionsCellRenderer";
import {
  deleteConfirmationMessage,
  EventsUrl,
  HIGH_PRIORITY,
} from "events/dashboard/consts";
import { useEffect, useRef, useState, useMemo } from "react";
import EventPriorityCellRenderer from "events/dashboard/grid/cell-renderers/eventPriorityCellRenderer";
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
import { usePagination } from "events/dashboard/grid/hooks/use-pagination";

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
    currentPage,
    currentPageData,
    isLastPage,
    error: fetchNextPageError,
    loading: fetchNextPageLoading,
    goToNextPage,
    goToPreviousPage,
  } = usePagination<
    {
      events: Event7FormTypeWithId[];
      nextPageAvailable: boolean;
    },
    Event7FormTypeWithId[]
  >({
    fetchNextPageData,
  });

  function fetchNextPageData(cursor: string) {
    return axios.get<{
      events: Event7FormTypeWithId[];
      nextPageAvailable: boolean;
    }>(EventsUrl + `cursored/${cursor}`);
  }

  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.hideOverlay();
      if (loading || fetchNextPageLoading) {
        gridRef?.current?.api.showLoadingOverlay();
      }
    }
  }, [loading, fetchNextPageLoading]);

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
    if (selectedEvent && hasIdProperty(selectedEvent)) {
      setLoading(true);
      axios({
        data: selectedEvent,
        url: EventsUrl + selectedEvent.id,
        method: "DELETE",
      })
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

  const rowClassRules: RowClassRules<Event7FormType> = useMemo(
    () => ({
      "red-rows": (params) =>
        (params?.data?.priority || 1) > HIGH_PRIORITY &&
        theme.palette.mode === "light",
      "dark-red-rows": (params) =>
        (params?.data?.priority || 1) > HIGH_PRIORITY &&
        theme.palette.mode === "dark",
    }),
    [theme.palette.mode]
  );

  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef.current.api.redrawRows();
    }
  }, [rowClassRules]);

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
          rowClassRules={rowClassRules}
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
            disabled={isLastPage}
          >
            Next page
          </Button>
        </div>
      </div>
    </>
  );
}
