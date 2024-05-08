const allIntEqual = (input: number[]) => {
  const firstInt = Math.floor(input[0]);
  return input.every((val) => Math.floor(val) === firstInt);
};

export const useNearlyEqual = (props: { [x: string]: number }) => {
  const nearlyEqual = allIntEqual(Object.values(props));

  console.log(
    nearlyEqual ? "SUCCESS" : "FAILURE",
    "\n",
    JSON.stringify(props, null, 4)
  );
};
