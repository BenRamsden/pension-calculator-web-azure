import { Dayjs } from "dayjs";
import state_pension_age from "../data/state_pension_age.json";
import {
  DEFAULT_STATE_PENSION_AGE,
  DEFAULT_STATE_PENSION_WEEKLY_AMOUNT,
} from "../config";

type StatePensionReturn = {
  statePensionAge: number;
  statePensionWeeklyAmount: number;
  statePensionNote: string | null;
};

export const useStatePension = ({
  dob,
}: {
  dob: Dayjs;
}): StatePensionReturn => {
  const results = state_pension_age.filter((row) => {
    return (
      dob.isBefore(row.dob_on_or_before, "day") ||
      dob.isSame(row.dob_on_or_before, "day")
    );
  });

  if (results.length === 0) {
    return {
      statePensionAge: DEFAULT_STATE_PENSION_AGE,
      statePensionWeeklyAmount: DEFAULT_STATE_PENSION_WEEKLY_AMOUNT,
      statePensionNote: null,
    };
  }

  return {
    statePensionAge: results[0].retire_age,
    statePensionWeeklyAmount: DEFAULT_STATE_PENSION_WEEKLY_AMOUNT,
    statePensionNote: results[0].note,
  };
};
