import { FieldValues, useController } from "react-hook-form";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";

interface IProps extends StandardTextFieldProps, FieldValues {}
export const ControlledInput = ({
  name,
  label,
  control,
  multiline,
}: IProps) => {
  const {
    field,
    fieldState: { invalid, isDirty, error },
  } = useController({
    name: name!,
    control,
  });
  return (
    <TextField
      {...field}
      name={name}
      helperText={error ? error.message : null}
      size="small"
      error={!!invalid && isDirty}
      fullWidth
      multiline={multiline}
      label={label}
      variant="outlined"
    />
  );
};
