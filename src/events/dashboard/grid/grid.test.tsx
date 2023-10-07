import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EventsGrid } from "events/dashboard/grid/grid";
import axios from "axios";
import { EventsUrl, deleteConfirmationMessage } from "events/dashboard/consts";
import MockAdapter from "axios-mock-adapter";
import { EditEventTitle } from "events/dashboard/create-edit-event/consts";

const mock = new MockAdapter(axios);
beforeAll(() => {
  mock.reset();
  const eventsMockData = [
    {
      id: 1,
      priority: 5,
      name: "click-event",
      description:
        "when the user clicks the button the event should be triggered",
      type: "APP",
    },
  ];
  mock.onGet(EventsUrl).reply(200, eventsMockData);
});

describe("Grid screen", () => {
  it('Clicking "Create New Event" button opens a dialog', async () => {
    render(<EventsGrid />);
    const eventName = screen.getByTestId("create event button");
    fireEvent.click(eventName);
    const dialog = screen.queryByRole("dialog");
    await waitFor(() => expect(dialog).toBeInTheDocument());
  });

  it('Clicking "Edit Event" button opens a dialog', async () => {
    const eventsGrid = render(<EventsGrid />);
    const loadingText = screen.getByText("Loading...");

    expect(loadingText).toBeInTheDocument();
    await waitFor(() => {
      expect(loadingText).not.toBeInTheDocument();
    });
    eventsGrid.rerender(<EventsGrid />);
    const editEventButton = screen.getByLabelText("edit the event");
    expect(editEventButton).toBeInTheDocument();
    fireEvent.click(editEventButton);
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(EditEventTitle);
  });

  it('Clicking "Delete Event" button opens a dialog', async () => {
    const eventsGrid = render(<EventsGrid />);
    const loadingText = screen.getByText("Loading...");

    expect(loadingText).toBeInTheDocument();
    await waitFor(() => {
      expect(loadingText).not.toBeInTheDocument();
    });
    eventsGrid.rerender(<EventsGrid />);
    const deleteEventButton = screen.getByLabelText("delete the event");
    expect(deleteEventButton).toBeInTheDocument();
    fireEvent.click(deleteEventButton);
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(deleteConfirmationMessage);
  });
});
