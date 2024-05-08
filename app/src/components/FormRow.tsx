import { FC, ReactNode } from "react";
import { Stack, SxProps } from "@mui/material";

type FormRowProps = {
  children?: ReactNode;
  sx?: SxProps;
};
export const FormRow: FC<FormRowProps> = ({ children, sx }) => (
  <Stack
    direction="row"
    sx={{ justifyContent: "space-between", alignItems: "center", py: 1, ...sx }}
    spacing={2}
  >
    {children}
  </Stack>
);
