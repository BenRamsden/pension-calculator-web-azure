import dayjs from "dayjs";
import { useLifeExpectancy } from "./useLifeExpectancy";
import { useFinalPotValue } from "./useFinalPotValue";
import { useStatePension } from "./useStatePension";
import {
  SalaryProjectionRow,
  useSalaryProjection,
} from "./useSalaryProjection";
import { z } from "zod";
import { useNearlyEqual } from "./useNearlyEqual";

export const PensionCalculatorPropsValidator = z
  .object({
    dob: z.any(),
    gender: z.string().min(1),
    plannedRetireAge: z.number().min(55).max(68),
    salary: z.number(),
    employeePct: z.number(),
    employerPct: z.number(),
    currentPotValue: z.number(),
    lumpSumPct: z.number(),
    yearlyInterestPct: z.number(),
    yearlyPensionChargesPct: z.number(),
    yearlyInflationPct: z.number(),
    salaryProjectionEnabled: z.boolean(),
    earlyDrawDownBiasPct: z.number(),
  })
  .nullable();

export type PensionCalculatorProps = z.infer<
  typeof PensionCalculatorPropsValidator
>;

export type PensionCalculatorReturn = {
  finalPotValue: number;
  taxFreeLump: number;
  likelyDeathAge: number;
  statePensionAge: number;
  statePensionWeeklyAmount: number;
  statePensionNote: string | null;
  yearlyStatePension: number;
  salaryProjection: SalaryProjectionRow[];
  preStatePrivateAnnuity: number;
  postStatePrivateAnnuity: number;
  earlyRetirement: boolean;
} | null;

export const usePensionCalculator = (
  props: PensionCalculatorProps
): PensionCalculatorReturn => {
  if (props === null) {
    return null;
  }

  const {
    dob,
    gender,
    salary,
    employeePct,
    employerPct,
    plannedRetireAge,
    currentPotValue,
    lumpSumPct,
    yearlyInterestPct,
    yearlyPensionChargesPct,
    yearlyInflationPct,
    salaryProjectionEnabled,
    earlyDrawDownBiasPct,
  } = props;

  const currentDate = dayjs();
  const age = currentDate.diff(dob, "years");

  const { salaryProjection } = useSalaryProjection({
    age,
    salary,
    plannedRetireAge,
    salaryProjectionEnabled,
  });

  const { finalPotValue } = useFinalPotValue({
    dob,
    salary,
    employeePct,
    employerPct,
    plannedRetireAge,
    currentPotValue,
    yearlyInterestPct,
    yearlyPensionChargesPct,
    yearlyInflationPct,
    salaryProjection,
  });

  const { likelyDeathAge } = useLifeExpectancy({
    age,
    gender,
  });

  const { statePensionAge, statePensionWeeklyAmount, statePensionNote } =
    useStatePension({
      dob,
    });

  const yearlyStatePension = statePensionWeeklyAmount * 52;

  const taxFreeLump = finalPotValue * (lumpSumPct * 0.01);
  const retirementYears = likelyDeathAge - plannedRetireAge;
  const potAfterLumpSum = finalPotValue - taxFreeLump;

  const postStateRetirementYears = likelyDeathAge - statePensionAge;
  const preStateRetirementYears = statePensionAge - plannedRetireAge;

  let postStatePotSplit =
    (potAfterLumpSum / retirementYears) * postStateRetirementYears;
  let preStatePotSplit =
    (potAfterLumpSum / retirementYears) * preStateRetirementYears;
  const earlyRetirement = plannedRetireAge < statePensionAge;

  if (earlyDrawDownBiasPct !== 0 && earlyRetirement) {
    const adjustmentAmount = postStatePotSplit * (earlyDrawDownBiasPct / 100);
    postStatePotSplit -= adjustmentAmount;
    preStatePotSplit += adjustmentAmount;
  }

  const preStatePrivateAnnuity = preStatePotSplit / preStateRetirementYears;
  const postStatePrivateAnnuity = postStatePotSplit / postStateRetirementYears;

  // TODO: Remove sanity checks once unit testing in place
  console.log("--- Calculator Sanity Checks ---");
  useNearlyEqual({
    totalRetirementYears: retirementYears,
    totalRetirementYearsNew: preStateRetirementYears + postStateRetirementYears,
  });
  useNearlyEqual({
    potAfterLumpSum,
    sumOfPotSplits: preStatePotSplit + postStatePotSplit,
    sumOfAnnuities:
      preStatePrivateAnnuity * preStateRetirementYears +
      postStatePrivateAnnuity * postStateRetirementYears,
  });

  return {
    finalPotValue,
    taxFreeLump,
    likelyDeathAge,
    statePensionAge,
    statePensionWeeklyAmount,
    statePensionNote,
    yearlyStatePension,
    salaryProjection,
    preStatePrivateAnnuity,
    postStatePrivateAnnuity,
    earlyRetirement,
  };
};
