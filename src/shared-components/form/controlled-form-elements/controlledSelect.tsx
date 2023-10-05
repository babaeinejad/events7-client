import { FieldValues, useController } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { OptionItem } from "shared-components/form/types";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";

interface IProps extends SelectProps, FieldValues {
  options: OptionItem[];
  loading: boolean;
}
export const ControlledSelect = ({
  name,
  label,
  control,
  options,
  loading,
}: IProps) => {
  const {
    field,
    fieldState: { invalid, isDirty, error },
  } = useController({
    name: name!,
    control,
  });
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">
        {loading ? <CircularProgress size={24} /> : label}
      </InputLabel>
      <Select {...field} label={label} name={name}>
        {options?.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {invalid && isDirty && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
};
