import pay_by_age from "../data/pay_by_age.json";

type SalaryProjectionProps = {
  age: number;
  salary: number;
  plannedRetireAge: number;
  salaryProjectionEnabled: boolean;
};

export type SalaryProjectionRow = {
  age: number;
  salary: number;
};

type SalaryProjectionReturn = {
  salaryProjection: SalaryProjectionRow[];
};

const getMedianPayForAgeGroup = (age: number) => {
  return pay_by_age.filter(
    (row) =>
      age >= row.min_age && (row.max_age === null ? true : age <= row.max_age)
  );
};

export const useSalaryProjection = ({
  age,
  salary,
  plannedRetireAge,
  salaryProjectionEnabled,
}: SalaryProjectionProps) => {
  const salaryProjection = [];

  const results = getMedianPayForAgeGroup(age);

  let salaryRatio = null;

  if (results.length > 0) {
    // Calculate individuals salary vs median, store ratio
    salaryRatio = salary / results[0].median_salary_full_time;
  }

  for (let currentAge = age + 1; currentAge <= plannedRetireAge; currentAge++) {
    const iteration_results = getMedianPayForAgeGroup(currentAge);
    let iteration_median = null;
    if (iteration_results !== null) {
      iteration_median = iteration_results[0].median_salary_full_time;
    }
    // Multiply median salary by ratio, scale individuals salary for age
    const currentSalary =
      salaryRatio === null || iteration_median === null
        ? salary
        : iteration_median * salaryRatio;
    salaryProjection.push({
      age: currentAge,
      salary: salaryProjectionEnabled ? Math.floor(currentSalary) : salary,
    });
  }

  return {
    salaryProjection,
  };
};
