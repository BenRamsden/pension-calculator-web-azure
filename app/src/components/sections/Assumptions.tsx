import { Box, Button, Paper, Stack, Switch, Typography } from "@mui/material";
import { usePensionState } from "../../providers/PensionStateProvider";
import { useFormState } from "../../providers/FormStateProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo, useState } from "react";
import { FormRow } from "../FormRow";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SectionTitle } from "../SectionTitle";
import { FormInputPercentageSlider } from "../FormInputPercentageSlider";
import { DEFAULT_ADVANCED_MODE } from "../../config";
import { AssumptionAccordion } from "../AssumptionAccordion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

export const Assumptions = () => {
  const { parsedForm, dispatch } = useFormState();
  const { result } = usePensionState();

  if (parsedForm === null || result === null) {
    return null;
  }

  const data = {
    labels: result.salaryProjection.map((row) => row.age),
    datasets: [
      {
        label: "Salary",
        data: result.salaryProjection.map((row) => row.salary),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Stack spacing={2}>
      <SectionTitle>Assumptions</SectionTitle>
      <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", maxWidth: "25em" }}>
        <AssumptionAccordion
          title={`Salary Projection ${
            parsedForm.salaryProjectionEnabled ? "On" : "Off"
          }`}
          description="Using your current salary and age to predict income changes over your lifetime"
        >
          <Line options={options} data={data} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            Toggle
            <Switch
              checked={parsedForm.salaryProjectionEnabled}
              onChange={(e) =>
                dispatch({
                  type: "SET_SALARY_PROJECTION_ENABLED",
                  value: e.target.checked,
                })
              }
            />
          </Stack>
        </AssumptionAccordion>
        <AssumptionAccordion
          title={`${parsedForm.yearlyInterestPct}% Yearly Interest`}
          description="Yearly compound interest on your pension pot"
        >
          <FormInputPercentageSlider
            value={parsedForm.yearlyInterestPct}
            onChange={(value) =>
              dispatch({ type: "SET_YEARLY_INTEREST_PCT", value })
            }
            min={0}
            max={15}
            step={0.5}
          />
        </AssumptionAccordion>
        <AssumptionAccordion
          title={`${parsedForm.yearlyPensionChargesPct}% Yearly Pension Charge`}
          description="Yearly charge deducted from the total value of your pension pot"
        >
          <FormInputPercentageSlider
            value={parsedForm.yearlyPensionChargesPct}
            onChange={(value) =>
              dispatch({ type: "SET_YEARLY_PENSION_CHARGES_PCT", value })
            }
            min={0}
            max={15}
            step={0.25}
          />
        </AssumptionAccordion>
        <AssumptionAccordion
          title={`${parsedForm.yearlyInflationPct}% Yearly Inflation`}
          description="Yearly inflation rate, adjusting for this ensures that results are in terms of buying power of today's money"
        >
          <FormInputPercentageSlider
            value={parsedForm.yearlyInflationPct}
            onChange={(value) =>
              dispatch({ type: "SET_YEARLY_INFLATION_PCT", value })
            }
            min={0}
            max={15}
            step={0.5}
          />
        </AssumptionAccordion>
        {result.statePensionNote && (
          <FormRow sx={{ justifyContent: "center" }}>
            <Typography>* {result.statePensionNote}</Typography>
          </FormRow>
        )}
      </Paper>
    </Stack>
  );
};
