import { Stack, Typography } from "@mui/material";
import { useWindowSize } from "../hooks/useWindowSize";
import { Questions } from "../components/sections/Questions";
import { Results } from "../components/sections/Results";
import { Assumptions } from "../components/sections/Assumptions";
import { SectionTitle } from "../components/SectionTitle";

export const Home = () => {
  const { mobile } = useWindowSize();

  return (
    <>
      <Stack spacing={4}>
        <Questions />
        <Assumptions />
        <Results />
      </Stack>
    </>
  );
};
