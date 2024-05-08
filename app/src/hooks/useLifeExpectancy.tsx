import female_cohort_ex from "../data/female_cohort_ex.json";
import male_cohort_ex from "../data/male_cohort_ex.json";

type LifeExpectancyProps = {
  age: number;
  gender: string;
};
type LifeExpectancyReturn = {
  likelyDeathAge: number;
};

const getData = (gender: string) => {
  switch (gender) {
    case "male":
      return male_cohort_ex;
    case "female":
      return female_cohort_ex;
    default:
      return [];
  }
};

export const useLifeExpectancy = ({
  age,
  gender,
}: LifeExpectancyProps): LifeExpectancyReturn => {
  const data = getData(gender);
  const projections = data.filter((r) => r.age === age);

  if (projections.length === 0) {
    return {
      // UK Average Life Expectancy 2022
      likelyDeathAge: 80.9,
    };
  }

  const yearsLeft = projections[0]["2022"];
  return {
    likelyDeathAge: age + yearsLeft,
  };
};
