import { ZodError } from "zod";
import { Typography } from "@mui/material";

export const ZodErrorDisplay = ({
  parseError,
  field,
}: {
  parseError: ZodError | null;
  field: string;
}) => {
  if (parseError === null) {
    return null;
  }
  const fieldIssue = parseError.issues.find(
    (i) => typeof i.path[0] === "string" && i.path[0] === field
  );
  if (fieldIssue === undefined) {
    return null;
  }
  return (
    <Typography sx={{ color: "red" }} textAlign="right">
      {fieldIssue.message}
    </Typography>
  );
};
