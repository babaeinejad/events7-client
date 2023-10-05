import { FieldValues, useController } from "react-hook-form";
import Slider, { SliderProps } from "@mui/material/Slider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface IProps extends SliderProps, FieldValues {}
export const ControlledSlider = ({
  name,
  label,
  control,
  min = 1,
  max = 10,
}: IProps) => {
  const { field } = useController({
    name: name!,
    control,
  });
  return (
    <div className="flex flex-col px-2">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <FormControl fullWidth>
        <Slider
          className="h-2"
          {...field}
          aria-label="Priority"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={min}
          max={max}
        />
      </FormControl>
    </div>
  );
};
