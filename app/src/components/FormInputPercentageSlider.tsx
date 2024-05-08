import { Box, Slider, Typography } from "@mui/material";
import { FormRow } from "./FormRow";

export const FormInputPercentageSlider = ({
  title,
  value,
  onChange,
  min,
  max,
  step,
}: {
  title?: string;
  value: number;
  onChange: (x: number) => void;
  min: number;
  max: number;
  step: number;
}) => {
  return (
    <FormRow>
      {title && (
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ textAlign: "left" }}>{title}</Typography>
        </Box>
      )}
      <Box sx={{ flex: 1 }}>
        <Slider
          {...{ value, min, max, step }}
          onChange={(e, newValue) =>
            typeof newValue === "number" && onChange(newValue)
          }
        />
      </Box>
      <Box sx={{ flex: 0.5 }}>
        <Typography>{value}%</Typography>
      </Box>
    </FormRow>
  );
};
