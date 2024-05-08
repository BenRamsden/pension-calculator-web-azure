import dayjs, { Dayjs } from "dayjs";
import { SalaryProjectionRow } from "./useSalaryProjection";

const getProjectedSalary = ({
  salaryProjection,
  currentAge,
  salary,
}: {
  salaryProjection: SalaryProjectionRow[];
  currentAge: number;
  salary: number;
}) => {
  const projections = salaryProjection.filter((v) => v.age === currentAge);
  return projections.length === 0 ? salary : projections[0].salary;
};

const applyCompound = ({
  currentPotValue,
  yearlyAdjustment,
  employeePct,
  employerPct,
  yearlyInterestPct,
  projectedSalary,
}: {
  currentPotValue: number;
  yearlyAdjustment: number;
  employeePct: number;
  employerPct: number;
  yearlyInterestPct: number;
  projectedSalary: number;
}) => {
  currentPotValue *= yearlyAdjustment;

  const employeeContributionPerYear = projectedSalary * employeePct * 0.01;
  const employerContributionPerYear = projectedSalary * employerPct * 0.01;
  const cashIn = employeeContributionPerYear + employerContributionPerYear;
  const cashInAverageInterest = (cashIn / 2) * (yearlyInterestPct * 0.01);

  currentPotValue += cashIn + cashInAverageInterest;
  return currentPotValue;
};

export const useFinalPotValue = ({
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
}: {
  dob: Dayjs;
  salary: number;
  employeePct: number;
  employerPct: number;
  plannedRetireAge: number;
  currentPotValue: number;
  yearlyInterestPct: number;
  yearlyPensionChargesPct: number;
  yearlyInflationPct: number;
  salaryProjection: SalaryProjectionRow[];
}) => {
  const currentDate = dayjs();
  // TODO: Remove duplication of age calc
  const age = currentDate.diff(dob, "years");
  const ageFloat = currentDate.diff(dob, "years", true);
  const leftOfYear = ageFloat - age;

  // Calculate change between now (decimal age) and the first int age (age+1)
  const leftOfYearAdjustment =
    1 +
    yearlyInterestPct * 0.01 * leftOfYear -
    yearlyPensionChargesPct * 0.01 * leftOfYear -
    yearlyInterestPct * 0.01 * leftOfYear;

  currentPotValue = applyCompound({
    currentPotValue,
    yearlyAdjustment: leftOfYearAdjustment,
    employeePct: employeePct * leftOfYear,
    employerPct: employerPct * leftOfYear,
    yearlyInterestPct: employerPct * leftOfYear,
    projectedSalary: getProjectedSalary({
      salaryProjection,
      currentAge: age,
      salary,
    }),
  });

  // Calculate change between age+1 and retirement
  const yearlyAdjustment =
    1 +
    yearlyInterestPct * 0.01 -
    yearlyPensionChargesPct * 0.01 -
    yearlyInflationPct * 0.01;

  for (let currentAge = age + 1; currentAge < plannedRetireAge; currentAge++) {
    currentPotValue = applyCompound({
      currentPotValue,
      yearlyAdjustment,
      employeePct,
      employerPct,
      yearlyInterestPct,
      projectedSalary: getProjectedSalary({
        salaryProjection,
        currentAge,
        salary,
      }),
    });
  }

  return {
    finalPotValue: currentPotValue,
  };
};
