import { describe, it, expect } from "vitest";
import { cleanup, getByRole, render, screen } from "@testing-library/react";
import { EventFormDialog } from "events/dashboard/create-edit-event/createEditEvent";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { AvailableEventTypeUrl } from "./consts";
import { userEvent } from "@testing-library/user-event";
import { requiredErrorMessage } from "./formSchema";

const eventsTypeMockData = {
  CROSPROMO: "CROSPROMO",
  LIVEOPS: "LIVEOPS",
  APP: "APP",
  ADS: "ADS",
};

function expectRequiredErrorMessages(expectedCount: number) {
  const errorMessages = screen.queryAllByText(requiredErrorMessage, {
    exact: false,
  });
  expect(errorMessages.length).toBe(expectedCount);
}

async function waitForValidation() {
  await new Promise((resolve) => setTimeout(resolve, 100));
}

describe("Event Create/Edit Dialog", () => {
  describe("Form Validation", () => {
    beforeEach(() => {
      const mock = new MockAdapter(axios);
      mock.onGet(AvailableEventTypeUrl).reply(200, eventsTypeMockData);
      render(<EventFormDialog open handleClose={() => {}} />);
    });

    afterEach(() => {
      cleanup();
    });

    it('displays "required" error messages', async () => {
      expectRequiredErrorMessages(0);
      const submitButton = screen.getByTestId("confirm-create-edit");
      userEvent.click(submitButton);
      await waitForValidation();
      expectRequiredErrorMessages(3);
    });

    it('removes "required" error messages when input fields are filled', async () => {
      const submitButton = screen.getByTestId("confirm-create-edit");
      userEvent.click(submitButton);
      await waitForValidation();

      const nameTextField = screen
        .getByTestId("event-name")
        .querySelector("input");

      const descriptionTextField = screen
        .getByTestId("event-description")
        .querySelector("textarea");

      userEvent.type(descriptionTextField!, "a");
      await waitForValidation();
      expectRequiredErrorMessages(2);

      userEvent.type(nameTextField!, "a");
      await waitForValidation();
      expectRequiredErrorMessages(1);

      userEvent.click(getByRole(screen.getByTestId("event-type"), "button"));
      await waitForValidation();
      await userEvent.click(screen.getByText(/LIVEOPS/i));
      await waitForValidation();
      expectRequiredErrorMessages(0);
    });
  });
});
