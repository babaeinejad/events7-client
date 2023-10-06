import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EventFormDialog } from "events/dashboard/create-edit-event/createEditEvent";

describe("Event Create/Edit Dialog", () => {
  const errorMessage = "String must contain at least 1 character(s)";
  const checkTextError = async (textField: HTMLElement) => {
    fireEvent.change(textField, { target: { value: "a" } });
    fireEvent.change(textField, { target: { value: "" } });
    await waitFor(() =>
      expect(screen.queryByText(errorMessage)).toBeInTheDocument()
    );
    fireEvent.change(textField, { target: { value: "a" } });
    await waitFor(() => expect(screen.queryByText(errorMessage)).toBeNull());
  };

  it("should show and remove name error message", async () => {
    render(<EventFormDialog open handleClose={() => {}} />);
    const eventName = screen.getByTestId("event-name");
    checkTextError(eventName);
  });

  it("should show and remove description error message", async () => {
    render(<EventFormDialog open handleClose={() => {}} />);
    const eventDescription = screen.getByTestId("event-description");
    checkTextError(eventDescription);
  });

  it("submit button should be disabled and enabled according to form status", async () => {
    render(<EventFormDialog open handleClose={() => {}} />);

    const nameTextField = screen.getByTestId("event-name");
    const descriptionTextField = screen.getByTestId("event-description");
    fireEvent.change(nameTextField, { target: { value: "a" } });
    fireEvent.change(descriptionTextField, { target: { value: "a" } });
    const confirmBUtton = screen.getByLabelText("Confirm");
    await waitFor(() => expect(confirmBUtton).toBeDisabled());
  });
});
