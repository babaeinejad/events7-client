import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, useForm } from "react-hook-form";
import {
  CreateEvent7FormSchema,
  Event7FormType,
  Event7FormTypeWithId,
} from "events/dashboard/create-edit-event/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput } from "shared-components/form/controlled-form-elements/controlledInput";
import { Evnet7Types, ExtendedEvnet7Types, hasIdProperty } from "events/types";
import { ControlledSelect } from "shared-components/form/controlled-form-elements/controlledSelect";
import {
  AvailableEventTypeUrl,
  CreateEventTitle,
  EditEventTitle,
  defaultFormValue,
} from "events/dashboard/create-edit-event/consts";
import { useEffect, useState } from "react";
import { OptionItem } from "shared-components/form/types";
import { ControlledSlider } from "shared-components/form/controlled-form-elements/controlledSlider";
import { EventsUrl } from "events/dashboard/consts";
import { Alert, AlertTitle, CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";

interface IProps {
  open: boolean;
  data?: Event7FormType | Event7FormTypeWithId | null;
  handleClose: () => void;
  itemEditted?: (data: Event7FormTypeWithId) => void;
  itemCreated?: (data: Event7FormType) => void;
}
export function EventFormDialog({
  open,
  data,
  handleClose,
  itemEditted,
  itemCreated,
}: IProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [eventsTypeOptions, setEventsTypeOptions] = useState<OptionItem[]>([]);
  const isEdit = hasIdProperty(data) ? data?.id : false;
  const methods = useForm<Event7FormType>({
    resolver: zodResolver(CreateEvent7FormSchema),
    defaultValues: {
      ...defaultFormValue,
      type: eventsTypeOptions[0] ? eventsTypeOptions[0].value : "",
    },
    mode: "onChange",
  });

  const [error, setError] = useState("");
  const [availableTypesError, setAvailableTypesError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventTypeEnum, setEventTypeEnum] = useState<
    Evnet7Types | ExtendedEvnet7Types | null
  >(null);

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
        if (result.data) {
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
        methods.setValue("type", options[0].value);
      }
    }
  }, [eventTypeEnum, methods]);

  async function onFormSubmitted() {
    const isValid = await methods.trigger();
    if (isValid) {
      setLoading(true);
      const eventData = methods?.getValues();
      isEdit ? executeEdit(eventData) : executeCreate(eventData);
    }

    function executeEdit(eventData: Event7FormTypeWithId) {
      axios({
        method: "PUT",
        url: EventsUrl + eventData.id,
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
        });
    }

    function executeCreate(eventData: Event7FormType) {
      axios({
        method: "POST",
        url: EventsUrl,
        data: eventData,
      })
        .then((result) => {
          setError("");
          if (itemCreated) {
            itemCreated(result.data);
            methods.reset(defaultFormValue);
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
  function onCancelClicked() {
    handleClose();
  }

  return (
    <Form control={methods.control}>
      <Dialog open={open} fullScreen={fullScreen} onClose={handleClose}>
        <DialogTitle>{isEdit ? EditEventTitle : CreateEventTitle}</DialogTitle>
        <DialogContent className="w-full justify-center md:w-[600px] pt-6">
          <div className="flex gap-6 w-full h-full flex-col pt-4">
            {(error || availableTypesError) && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error ? error : availableTypesError}
              </Alert>
            )}
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
          <div className="flex p-3 gap-2">
            <Button onClick={onCancelClicked} aria-label="Cancel">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={methods.handleSubmit(onFormSubmitted)}
              aria-label="Confirm"
              disabled={loading}
              data-testid="confirm-create-edit"
            >
              {loading ? <CircularProgress size={24} /> : "Confirm"}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
