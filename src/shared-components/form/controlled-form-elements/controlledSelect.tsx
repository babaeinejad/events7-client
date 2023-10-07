import { FieldValues, useController } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { OptionItem } from "shared-components/form/types";
import FormHelperText from "@mui/material/FormHelperText";

interface IProps extends SelectProps, FieldValues {
  options: OptionItem[];
  loading: boolean;
  testId: string;
}
export const ControlledSelect = ({
  name,
  label,
  control,
  options,
  loading,
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
    <FormControl size="small" error={invalid}>
      <InputLabel>{label}</InputLabel>
      <Select
        data-testid={testId}
        disabled={loading}
        {...field}
        label={label}
        name={name}
        error={!!invalid}
      >
        {options?.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
};
