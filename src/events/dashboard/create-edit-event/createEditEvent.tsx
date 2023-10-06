import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateEvent7FormSchema,
  Event7FormType,
} from "events/dashboard/create-edit-event/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput } from "shared-components/form/controlled-form-elements/controlledInput";
import { Evnet7Types, ExtendedEvnet7Types } from "events/types";
import { ControlledSelect } from "shared-components/form/controlled-form-elements/controlledSelect";
import {
  AvailableEventTypeUrl,
  CreateEventTitle,
  EditEventTitle,
} from "./consts";
import { useEffect, useState } from "react";
import { OptionItem } from "shared-components/form/types";
import { ControlledSlider } from "shared-components/form/controlled-form-elements/controlledSlider";
import { EventsUrl } from "../consts";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import axios from "axios";

interface IProps {
  open: boolean;
  data?: Event7FormType | null;
  handleClose: () => void;
  itemEditted?: (data: Event7FormType) => void;
  itemCreated?: (data: Event7FormType) => void;
}
export function EventFormDialog({
  open,
  data,
  handleClose,
  itemEditted,
  itemCreated,
}: IProps) {
  const isEdit = data?.id;
  const methods = useForm<Event7FormType>({
    resolver: zodResolver(CreateEvent7FormSchema),
    defaultValues: {
      name: "",
      priority: 1,
      type: ExtendedEvnet7Types.CROSPROMO,
      description: "",
    },
    mode: "all",
  });

  const [error, setError] = useState("");
  const [availableTypesError, setAvailableTypesError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventTypeEnum, setEventTypeEnum] = useState<
    Evnet7Types | ExtendedEvnet7Types | null
  >(null);
  const [eventsTypeOptions, setEventsTypeOptions] = useState<OptionItem[]>([]);

  useEffect(() => {
    if (data) {
      methods.reset(data);
    }
  }, [data, methods]);

  useEffect(() => {
    axios({
      url: AvailableEventTypeUrl,
    })
      .then((result) => {
        setAvailableTypesError("");
        if (result.config) {
          setEventTypeEnum(result.data);
        }
      })
      .catch((err) => {
        setAvailableTypesError(err?.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (eventTypeEnum) {
      const options = Object.keys(eventTypeEnum).map((item) => ({
        label: item,
        value: item,
      }));
      if (options) {
        setEventsTypeOptions(options);
      }
    }
  }, [eventTypeEnum]);

  function onConfirmClicked() {
    const eventData = methods?.getValues();
    setLoading(true);
    isEdit
      ? axios({
          method: "PUT",
          url: EventsUrl + data.id,
          data: eventData,
        })
          .then((result) => {
            setError("");
            if (itemEditted) {
              itemEditted(result.data);
            }
          })
          .catch((err) => {
            setError(err?.response?.data?.message || err.message);
          })
          .finally(() => {
            setLoading(false);
          })
      : axios({
          method: "POST",
          url: EventsUrl,
          data: eventData,
        })
          .then((result) => {
            setError("");
            if (itemCreated) {
              itemCreated(result.data);
            }
          })
          .catch((err) => {
            setError(err?.response?.data?.message || err.message);
          })
          .finally(() => {
            setLoading(false);
          });
  }

  function onCancelClicked() {
    handleClose();
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? EditEventTitle : CreateEventTitle}</DialogTitle>
        <DialogContent className="w-full sm:w-[600px]">
          {(error || availableTypesError) && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error ? error : availableTypesError}
            </Alert>
          )}
          <div className="flex gap-6 mt-4 w-full h-full flex-col">
            <ControlledInput
              name="name"
              label="Name"
              type="text"
              placeholder="Name"
              control={methods.control}
              testId="event-name"
            />

            <ControlledInput
              name="description"
              label="Description"
              type="text"
              multiline
              placeholder="Description"
              control={methods.control}
              testId="event-description"
            />

            <ControlledSelect
              options={eventsTypeOptions}
              name="type"
              label="Type"
              control={methods.control}
              loading={loading}
              testId="event-type"
            ></ControlledSelect>

            <ControlledSlider
              name="priority"
              label="Priority"
              control={methods.control}
            ></ControlledSlider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelClicked} aria-label="Cancel">
            Cancel
          </Button>
          <Button
            aria-label="Confirm"
            disabled={
              loading ||
              !methods.formState.isValid ||
              !methods.formState.isDirty
            }
            onClick={onConfirmClicked}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
