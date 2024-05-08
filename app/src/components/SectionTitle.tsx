import { Typography } from "@mui/material";
import { ReactNode } from "react";

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Typography variant="h5" sx={{ color: "black" }}>
    {children}
  </Typography>
);
