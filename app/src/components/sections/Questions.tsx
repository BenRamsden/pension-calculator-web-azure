import { FC } from "react";
import { FormRow } from "../FormRow";
import {
  Checkbox,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormInputNumber } from "../FormInputNumber";
import "dayjs/locale/en-gb";
import { useFormState } from "../../providers/FormStateProvider";
import { SectionTitle } from "../SectionTitle";
import { ZodErrorDisplay } from "../ZodErrorDisplay";

export const Questions: FC = () => {
  const { state, dispatch, parseError } = useFormState();

  return (
    <Stack spacing={2}>
      <SectionTitle>Questions</SectionTitle>
      <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", maxWidth: "25em" }}>
        <FormRow>
          <Typography sx={{ flex: 1, textAlign: "left" }}>
            Date of Birth
          </Typography>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
          >
            <DatePicker
              views={["day", "month", "year"]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={null}
                  sx={{ flex: 1, backgroundColor: "white" }}
                  data-testid="date-of-birth-input"
                />
              )}
              value={state.dob}
              onChange={(value) => dispatch({ type: "SET_DOB", value })}
            />
          </LocalizationProvider>
        </FormRow>
        <FormRow>
          <Typography sx={{ flex: 1, textAlign: "left" }}>Gender</Typography>
          <Select
            value={state.gender}
            onChange={(e) =>
              dispatch({ type: "SET_GENDER", value: e.target.value })
            }
            sx={{ flex: 1, textAlign: "left", backgroundColor: "white" }}
            data-testid="gender-select"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormRow>
        <FormInputNumber
          title="Annual Salary (£)"
          value={state.salary}
          onChange={(value) => dispatch({ type: "SET_SALARY", value })}
          data-testid="salary-input"
        />
        <FormInputNumber
          title="Employee Contribution (%)"
          value={state.employeePct}
          onChange={(value) => dispatch({ type: "SET_EMPLOYEE_PCT", value })}
          data-testid="employee-pct-input"
        />
        <FormInputNumber
          title="Employer Contribution (%)"
          value={state.employerPct}
          onChange={(value) => dispatch({ type: "SET_EMPLOYER_PCT", value })}
          data-testid="employer-pct-input"
        />
        <FormInputNumber
          title="Planned Retirement Age"
          value={state.plannedRetireAge}
          onChange={(value) =>
            dispatch({ type: "SET_PLANNED_RETIRE_AGE", value })
          }
          data-testid="planned-retire-age-input"
        />
        {typeof state.plannedRetireAge === "number" &&
          !Number.isNaN(state.plannedRetireAge) && (
            <ZodErrorDisplay parseError={parseError} field="plannedRetireAge" />
          )}
        <FormInputNumber
          title="Current Pot Value (£)"
          value={state.currentPotValue}
          onChange={(value) =>
            dispatch({ type: "SET_CURRENT_POT_VALUE", value })
          }
          data-testid="current-pot-value-input"
        />
        <FormRow>
          <Stack sx={{ textAlign: "left" }}>
            <Typography>Save Answers For Later</Typography>
            <Typography variant="body2">(Local browser storage)</Typography>
          </Stack>
          <Stack sx={{ flex: 1 }} alignItems="flex-end">
            <Checkbox
              checked={state.saveAnswers}
              onChange={(e) =>
                dispatch({ type: "SET_SAVE_ANSWERS", value: e.target.checked })
              }
            />
          </Stack>
        </FormRow>
      </Paper>
    </Stack>
  );
};
