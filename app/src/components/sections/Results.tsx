import { FormRow } from "../FormRow";
import { Box, Button, Paper, Stack, Switch, Typography } from "@mui/material";
import { FormInputPercentageSlider } from "../FormInputPercentageSlider";
import { FC, useState } from "react";
import { DEFAULT_ADVANCED_MODE } from "../../config";
import { useFormState } from "../../providers/FormStateProvider";
import { usePensionState } from "../../providers/PensionStateProvider";
import { SectionTitle } from "../SectionTitle";

export const Results: FC = () => {
  const { parsedForm, dispatch } = useFormState();
  const { result } = usePensionState();

  if (parsedForm === null || result === null) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <SectionTitle>Results</SectionTitle>
      <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", maxWidth: "25em" }}>
        <FormRow>
          <Typography sx={{ flex: 2, textAlign: "left" }}>
            Final Pot Value
          </Typography>
          <Typography
            variant="h6"
            sx={{ flex: 1, textAlign: "right" }}
            data-testid="final-pot-value"
          >
            £&nbsp;{result.finalPotValue.toFixed(0)}
          </Typography>
        </FormRow>
        <FormRow>
          <Typography sx={{ flex: 2, textAlign: "left" }}>
            Tax Free Lump
          </Typography>
          <Typography
            variant="h6"
            sx={{ flex: 1, textAlign: "right" }}
            data-testid="tax-free-lump"
          >
            £&nbsp;{result.taxFreeLump.toFixed(0)}
          </Typography>
        </FormRow>
        <FormInputPercentageSlider
          title="Tax Free (%)"
          min={0}
          max={25}
          step={1}
          value={parsedForm.lumpSumPct}
          onChange={(value) => dispatch({ type: "SET_LUMP_SUM_PCT", value })}
        />
        {result.earlyRetirement && (
          <>
            <FormRow>
              <Box sx={{ flex: 1.5, textAlign: "left" }}>
                <Typography>
                  Income Age {parsedForm.plannedRetireAge} to{" "}
                  {result.statePensionAge - 1}
                </Typography>
                <Typography variant="body2">(Private Pension)</Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ flex: 1, textAlign: "right" }}
                data-testid="private-income"
              >
                £&nbsp;{result.preStatePrivateAnnuity.toFixed(0)} per&nbsp;year
              </Typography>
            </FormRow>
            <FormInputPercentageSlider
              title="Pre State Pension Private Annuity Bias"
              value={parsedForm.earlyDrawDownBiasPct}
              onChange={(value) =>
                dispatch({ type: "SET_EARLY_DRAW_DOWN_BIAS_PCT", value })
              }
              min={0}
              max={100}
              step={1}
            />
          </>
        )}
        <FormRow>
          <Box sx={{ flex: 1.5, textAlign: "left" }}>
            <Typography>Income Age {result.statePensionAge}+</Typography>
            <Typography variant="body2">
              (
              {result.postStatePrivateAnnuity !== 0 ? (
                <>Private&nbsp;Pension, </>
              ) : (
                ""
              )}
              State&nbsp;Pension)
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ flex: 1, textAlign: "right" }}
            data-testid="private-and-state-income"
          >
            £&nbsp;
            {(
              result.postStatePrivateAnnuity + result.yearlyStatePension
            ).toFixed(0)}{" "}
            per&nbsp;year
          </Typography>
        </FormRow>
      </Paper>
    </Stack>
  );
};
