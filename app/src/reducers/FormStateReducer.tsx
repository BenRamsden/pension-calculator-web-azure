import { useReducer } from "react";
import { Dayjs } from "dayjs";
import {
  DEFAULT_CURRENT_POT_VALUE,
  DEFAULT_DOB,
  DEFAULT_EARLY_DRAW_DOWN_BIAS_PCT,
  DEFAULT_EMPLOYEE_CONTRIBUTION,
  DEFAULT_EMPLOYER_CONTRIBUTION,
  DEFAULT_GENDER,
  DEFAULT_LUMP_SUM_PCT,
  DEFAULT_PLANNED_RETIREMENT_AGE,
  DEFAULT_SALARY,
  DEFAULT_SALARY_PROJECTION_ENABLED,
  DEFAULT_YEARLY_INFLATION_PCT,
  DEFAULT_YEARLY_INTEREST_PCT,
  DEFAULT_YEARLY_PENSION_CHARGES_PCT,
} from "../config";

export type FormStateReducerState = {
  dob: Dayjs | null;
  gender: string | null;
  salary: number | null;
  employeePct: number | null;
  employerPct: number | null;
  plannedRetireAge: number | null;
  currentPotValue: number | null;
  lumpSumPct: number;
  yearlyInterestPct: number;
  yearlyPensionChargesPct: number;
  yearlyInflationPct: number;
  salaryProjectionEnabled: boolean;
  earlyDrawDownBiasPct: number;
  saveAnswers: boolean;
};

export const defaultFormState: FormStateReducerState = {
  dob: DEFAULT_DOB,
  gender: DEFAULT_GENDER,
  salary: DEFAULT_SALARY,
  employeePct: DEFAULT_EMPLOYEE_CONTRIBUTION,
  employerPct: DEFAULT_EMPLOYER_CONTRIBUTION,
  plannedRetireAge: DEFAULT_PLANNED_RETIREMENT_AGE,
  currentPotValue: DEFAULT_CURRENT_POT_VALUE,
  lumpSumPct: DEFAULT_LUMP_SUM_PCT,
  yearlyInterestPct: DEFAULT_YEARLY_INTEREST_PCT,
  yearlyPensionChargesPct: DEFAULT_YEARLY_PENSION_CHARGES_PCT,
  yearlyInflationPct: DEFAULT_YEARLY_INFLATION_PCT,
  salaryProjectionEnabled: DEFAULT_SALARY_PROJECTION_ENABLED,
  earlyDrawDownBiasPct: DEFAULT_EARLY_DRAW_DOWN_BIAS_PCT,
  saveAnswers: false,
};

export type FormStateReducerAction =
  | {
      type: "SET_DOB";
      value: Dayjs | null;
    }
  | {
      type: "SET_GENDER";
      value: string | null;
    }
  | {
      type: "SET_SALARY";
      value: number | null;
    }
  | {
      type: "SET_EMPLOYEE_PCT";
      value: number | null;
    }
  | {
      type: "SET_EMPLOYER_PCT";
      value: number | null;
    }
  | {
      type: "SET_PLANNED_RETIRE_AGE";
      value: number | null;
    }
  | {
      type: "SET_CURRENT_POT_VALUE";
      value: number | null;
    }
  | {
      type: "SET_LUMP_SUM_PCT";
      value: number;
    }
  | {
      type: "SET_YEARLY_INTEREST_PCT";
      value: number;
    }
  | {
      type: "SET_YEARLY_PENSION_CHARGES_PCT";
      value: number;
    }
  | {
      type: "SET_YEARLY_INFLATION_PCT";
      value: number;
    }
  | {
      type: "SET_SALARY_PROJECTION_ENABLED";
      value: boolean;
    }
  | {
      type: "SET_EARLY_DRAW_DOWN_BIAS_PCT";
      value: number;
    }
  | {
      type: "SET_SAVE_ANSWERS";
      value: boolean;
    };

const reducer = (
  state: FormStateReducerState,
  action: FormStateReducerAction
): FormStateReducerState => {
  switch (action.type) {
    case "SET_DOB":
      return {
        ...state,
        dob: action.value,
      };
    case "SET_GENDER":
      return {
        ...state,
        gender: action.value,
      };
    case "SET_SALARY":
      return {
        ...state,
        salary: action.value,
      };
    case "SET_EMPLOYEE_PCT":
      return {
        ...state,
        employeePct: action.value,
      };
    case "SET_EMPLOYER_PCT":
      return {
        ...state,
        employerPct: action.value,
      };
    case "SET_PLANNED_RETIRE_AGE":
      return {
        ...state,
        plannedRetireAge: action.value,
      };
    case "SET_CURRENT_POT_VALUE":
      return {
        ...state,
        currentPotValue: action.value,
      };
    case "SET_LUMP_SUM_PCT":
      return {
        ...state,
        lumpSumPct: action.value,
      };
    case "SET_YEARLY_INTEREST_PCT":
      return {
        ...state,
        yearlyInterestPct: action.value,
      };
    case "SET_YEARLY_PENSION_CHARGES_PCT":
      return {
        ...state,
        yearlyPensionChargesPct: action.value,
      };
    case "SET_YEARLY_INFLATION_PCT":
      return {
        ...state,
        yearlyInflationPct: action.value,
      };
    case "SET_SALARY_PROJECTION_ENABLED":
      return {
        ...state,
        salaryProjectionEnabled: action.value,
      };
    case "SET_EARLY_DRAW_DOWN_BIAS_PCT":
      return {
        ...state,
        earlyDrawDownBiasPct: action.value,
      };
    case "SET_SAVE_ANSWERS":
      return {
        ...state,
        saveAnswers: action.value,
      };
    default:
      return state;
  }
};

export const useFormStateReducer = ({
  savedFormState,
}: {
  savedFormState?: Partial<FormStateReducerState>;
}) => {
  return useReducer(reducer, {
    ...defaultFormState,
    ...savedFormState,
  });
};
