import { FormRow } from "./FormRow";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const AssumptionAccordion = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack spacing={1}>
      <FormRow>
        <Stack sx={{ textAlign: "left" }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="subtitle2">{description}</Typography>
        </Stack>
        <IconButton onClick={() => setExpanded(!expanded)}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </FormRow>
      {expanded && (
        <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1 }}>
          {children}
        </Box>
      )}
    </Stack>
  );
};
