import { FieldValues, useController } from "react-hook-form";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";

interface IProps extends StandardTextFieldProps, FieldValues {
  testId: string;
}
export const ControlledInput = ({
  name,
  label,
  control,
  multiline,
  testId,
}: IProps) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name: name!,
    control,
  });

  return (
    <div className="flex">
      <TextField
        {...field}
        name={name}
        helperText={error ? error.message : null}
        size="small"
        error={!!invalid}
        fullWidth
        multiline={multiline}
        label={label}
        variant="outlined"
        inputProps={{
          "data-testid": testId,
        }}
      />
    </div>
  );
};
