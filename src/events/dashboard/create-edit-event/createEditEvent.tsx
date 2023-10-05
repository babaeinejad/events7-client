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
import useAxios from "axios-hooks";
import { AvailableEventTypeUrl } from "./consts";
import { useEffect, useState } from "react";
import { OptionItem } from "shared-components/form/types";
import { ControlledSlider } from "shared-components/form/controlled-form-elements/controlledSlider";
import { EventsUrl } from "../consts";
import { CircularProgress } from "@mui/material";

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

  useEffect(() => {
    if (data) {
      methods.reset(data);
    }
  }, [data, methods]);

  const [{ loading: editLoading }, executeEdit] = useAxios(
    { method: "PUT" },
    {
      manual: true,
    }
  );

  const [{ loading: createLoading }, executeCreate] = useAxios<Event7FormType>(
    { method: "POST" },
    {
      manual: true,
    }
  );

  const [availableEventsTypeOptions, setAvailableEventsTypeOptions] = useState<
    OptionItem[]
  >([]);

  const [{ data: eventTypeOptions, loading }] = useAxios<
    Evnet7Types | ExtendedEvnet7Types
  >(AvailableEventTypeUrl);
  useEffect(() => {
    if (eventTypeOptions) {
      const options = Object.keys(eventTypeOptions).map((item) => ({
        label: item,
        value: item,
      }));
      if (options) {
        setAvailableEventsTypeOptions(options);
      }
    }
  }, [eventTypeOptions]);

  function onConfirmClicked() {
    const eventData = methods?.getValues();
    isEdit
      ? executeEdit({
          url: EventsUrl + data.id,
          data: eventData,
        }).then((result) => {
          if (itemEditted) {
            itemEditted(result.data);
          }
        })
      : executeCreate({
          url: EventsUrl,
          data: eventData,
        }).then((result) => {
          if (itemCreated) {
            itemCreated(result.data);
          }
        });
  }

  function onCancelClicked() {
    handleClose();
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEdit ? "Modify Event Information" : "Create a New Event"}
        </DialogTitle>
        <DialogContent className="w-full sm:w-[600px]">
          <div className="flex gap-6 mt-4 w-full h-full flex-col">
            <ControlledInput
              name="name"
              label="Name"
              type="text"
              placeholder="Name"
              control={methods.control}
            />

            <ControlledInput
              name="description"
              label="Description"
              type="text"
              multiline
              placeholder="Description"
              control={methods.control}
            />

            <ControlledSelect
              options={availableEventsTypeOptions}
              name="type"
              label="Type"
              control={methods.control}
              loading={loading}
            ></ControlledSelect>

            <ControlledSlider
              name="priority"
              label="Priority"
              control={methods.control}
            ></ControlledSlider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelClicked}>Cancel</Button>
          <Button
            disabled={createLoading || editLoading}
            onClick={onConfirmClicked}
          >
            {createLoading || editLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
