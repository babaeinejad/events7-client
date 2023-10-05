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
    fieldState: { invalid, error },
  } = useController({
    name: name!,
    control,
  });
  return (
    <TextField
      className="h-10"
      {...field}
      name={name}
      helperText={error ? error.message : null}
      size="small"
      error={!!invalid}
      fullWidth
      multiline={multiline}
      label={label}
      variant="outlined"
    />
  );
};
