import "./App.css";
import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, Link, Stack, SxProps, Typography } from "@mui/material";
import { useWindowSize } from "./hooks/useWindowSize";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Home } from "./pages/Home";
import { FormStateProvider } from "./providers/FormStateProvider";
import { PensionStateProvider } from "./providers/PensionStateProvider";
import { useVisitCounter } from "./hooks/useVisitCounter";

const PaddedStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));
const NavBarSection = styled(Stack)(({ theme }) => ({
  flex: 1,
  alignItems: "center",
}));
const Gradient = styled(Stack)(({ theme }) => ({
  textAlign: "center",
  alignItems: "center",
}));
const NavLink = ({
  children,
  href,
  sx,
}: {
  children: string;
  href: string;
  sx?: SxProps;
}) => (
  <Link
    underline="none"
    color="common.white"
    variant="subtitle1"
    href={href}
    sx={sx}
  >
    {children}
  </Link>
);
function App() {
  const { mobile } = useWindowSize();
  const { data, error, isLoading } = useVisitCounter();

  return (
    <Stack sx={{ height: "100vh" }}>
      <PaddedStack
        direction="row"
        sx={{ justifyContent: "space-between", p: 2, backgroundColor: "#222" }}
      >
        <NavBarSection
          direction="row"
          justifyContent={mobile ? "center" : undefined}
        >
          <Typography color="common.white" variant="h6">
            Pension Calculator 🇬🇧
          </Typography>
        </NavBarSection>
        <NavBarSection
          direction="row"
          justifyContent="space-around"
          sx={{ display: mobile ? "none" : undefined }}
        ></NavBarSection>
        <NavBarSection
          direction="row"
          sx={{
            justifyContent: "flex-end",
            flex: mobile ? 0 : undefined,
            color: "white",
          }}
        >
          {data && `Visitor Count: ${data}`}
          {error && error.message}
          {isLoading && "Loading..."}
        </NavBarSection>
      </PaddedStack>
      <PaddedStack direction={"column"} sx={{ p: 0, height: "100%" }}>
        <Gradient sx={{ pt: 5, px: 3, height: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Calculate your retirement income
          </Typography>
          <Stack
            direction="row"
            spacing={-1}
            sx={{ py: 2, justifyContent: "center" }}
          >
            <HorizontalRuleIcon />
            <HorizontalRuleIcon />
          </Stack>
          <Typography variant="h5" sx={{ maxWidth: "500px" }}>
            Answer a few simple questions to see what retirement will look like.
          </Typography>
          <Box sx={{ py: 5 }}>
            <FormStateProvider>
              <PensionStateProvider>
                <Home />
              </PensionStateProvider>
            </FormStateProvider>
          </Box>
        </Gradient>
      </PaddedStack>
    </Stack>
  );
}

export default App;
