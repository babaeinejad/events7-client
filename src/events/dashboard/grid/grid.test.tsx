import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { EventsGrid } from "events/dashboard/grid/grid";
import axios from "axios";
import { EventsUrl, deleteConfirmationMessage } from "events/dashboard/consts";
import MockAdapter from "axios-mock-adapter";
import {
  CreateEventTitle,
  EditEventTitle,
} from "events/dashboard/create-edit-event/consts";
import { ExtendedEvnet7Types } from "events/types";
import {
  EventsContext,
  EventsContextType,
} from "events/context/events-context";
import { userEvent } from "@testing-library/user-event";

const mock = new MockAdapter(axios);
const eventsMockData = {
  nextPageAvailable: true,
  events: [
    {
      id: "1",
      priority: 5,
      name: "click-event",
      description:
        "when the user clicks the button the event should be triggered",
      type: ExtendedEvnet7Types.CROSPROMO,
    },
  ],
};

const mockDeleteEvent = vitest.fn();

const getNewContextValue = (fields?: Partial<EventsContextType>) => {
  return {
    deleteEvent: mockDeleteEvent,
    createEvent: vitest.fn(),
    updateEvent: vitest.fn(),
    goToPreviousPage: vitest.fn(),
    goToNextPage: vitest.fn(),
    error: "",
    loading: false,
    lastPage: 0,
    cursor: "0",
    currentPage: 0,
    currentPageData: [],
    ...fields,
  };
};

describe("Grid screen", () => {
  beforeAll(() => {
    mock.reset();
    mock.onGet(EventsUrl + "cursored/0").reply(200, eventsMockData);
    mock.onDelete(EventsUrl + "1").reply(200, eventsMockData);
  });

  const eventsGrid = (newValue?: Partial<EventsContextType>) => (
    <EventsContext.Provider value={getNewContextValue(newValue)}>
      <EventsGrid />
    </EventsContext.Provider>
  );

  const waitForGridToBeInTheDOM = () => {
    return waitFor(() => {
      expect(document.querySelector(".ag-root-wrapper")).toBeInTheDocument();
    });
  };

  const openDialog = async (actionButtonLabel: string) => {
    const component = render(eventsGrid());
    waitForGridToBeInTheDOM();
    component.rerender(
      eventsGrid({ loading: false, currentPageData: eventsMockData.events })
    );
    const actionButton = screen.getByLabelText(actionButtonLabel);
    expect(actionButton).toBeInTheDocument();
    await userEvent.click(actionButton);
  };

  it("show and hide loading on grid", async () => {
    const component = render(eventsGrid());
    waitForGridToBeInTheDOM();
    component.rerender(eventsGrid({ loading: true }));
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
    component.rerender(
      eventsGrid({ loading: false, currentPageData: eventsMockData.events })
    );
    await waitFor(() => {
      expect(loadingText).not.toBeInTheDocument();
    });
  });

  it('Clicking "Create New Event" button opens a dialog', async () => {
    await openDialog("Create New Event");
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toHaveTextContent(CreateEventTitle);
  });

  it('Clicking "Delete Event" button opens a dialog', async () => {
    await openDialog("delete the event");
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(deleteConfirmationMessage);
  });

  it('Clicking "Edit Event" button opens a dialog', async () => {
    await openDialog("edit the event");
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(EditEventTitle);
  });
});
