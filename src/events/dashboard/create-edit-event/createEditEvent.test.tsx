import { describe, it, expect } from "vitest";
import {
  fireEvent,
  getByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { EventFormDialog } from "events/dashboard/create-edit-event/createEditEvent";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { AvailableEventTypeUrl } from "./consts";
import UserEvent from "@testing-library/user-event";

const mock = new MockAdapter(axios);

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

  it("should show and remove description error message", async () => {
    render(<EventFormDialog open handleClose={() => {}} />);
    const eventDescription = screen
      .getByTestId("event-description")
      .querySelector("textarea");
    checkTextError(eventDescription!);
  });

  it("submit button should be disabled and enabled according to form status", async () => {
    const eventsTypeMockData = {
      CROSPROMO: "CROSPROMO",
      LIVEOPS: "LIVEOPS",
      APP: "APP",
      ADS: "ADS",
    };

    mock.onGet(AvailableEventTypeUrl).reply(200, eventsTypeMockData);
    render(<EventFormDialog open handleClose={() => {}} />);

    const nameTextField = screen
      .getByTestId("event-name")
      .querySelector("input");
    const descriptionTextField = screen
      .getByTestId("event-description")
      .querySelector("textarea");

    const slider = screen.getByRole("slider");
    UserEvent.click(getByRole(screen.getByTestId("event-type"), "button"));
    await waitFor(() => UserEvent.click(screen.getByText(/LIVEOPS/i)));
    fireEvent.input(nameTextField!, { target: { value: "a" } });
    fireEvent.input(descriptionTextField!, { target: { value: "b" } });
    console.log(descriptionTextField!.value);
    fireEvent.input(slider, { target: { value: "2" } });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const confirmBUtton = screen.getByLabelText("Confirm");
    await waitFor(() => expect(confirmBUtton).toBeEnabled());
    fireEvent.input(nameTextField!, { target: { value: "" } });
    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitFor(() => expect(confirmBUtton).toBeDisabled());
  });
});
