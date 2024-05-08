import { TextField, Typography } from "@mui/material";
import { FC } from "react";
import { FormRow } from "./FormRow";

type FormInputNumberProps = {
  title: string;
  value: number | null;
  onChange: (value: number | null) => void;
  "data-testid"?: string;
};
export const FormInputNumber: FC<FormInputNumberProps> = ({
  title,
  value,
  onChange,
  "data-testid": dataTestId,
}) => {
  return (
    <FormRow>
      <Typography sx={{ flex: 1, textAlign: "left" }}>{title}</Typography>
      <TextField
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        sx={{ flex: 1, backgroundColor: "white" }}
        data-testid={dataTestId}
      />
    </FormRow>
  );
};
