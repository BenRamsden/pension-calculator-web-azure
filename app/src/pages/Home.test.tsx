import { Home } from "./Home";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { FormStateProvider } from "../providers/FormStateProvider";
import { PensionStateProvider } from "../providers/PensionStateProvider";

jest.mock("../config");

const testNumberInput = (dataTestId: string, value: number) => {
  const input = within(screen.getByTestId(dataTestId)).getByRole("spinbutton");
  expect(input).toBeInTheDocument();
  act(() => {
    fireEvent.change(input, { target: { value: `${value}` } });
  });
  expect(input).toHaveValue(value);
};

describe("<Home/>", () => {
  it("renders", () => {
    // TODO: DRY, prevent replicating providers here
    render(
      <FormStateProvider>
        <PensionStateProvider>
          <Home />
        </PensionStateProvider>
      </FormStateProvider>
    );

    expect(screen.queryByText("Date of Birth")).toBeInTheDocument();

    const dobPicker = within(
      screen.getByTestId("date-of-birth-input")
    ).getByRole("textbox");
    expect(dobPicker).toBeTruthy();
    fireEvent.change(dobPicker, { target: { value: "01/01/2000" } });
    expect(dobPicker).toHaveValue("01/01/2000");

    const genderSelect = screen.getByTestId("gender-select");
    const genderSelectButton = within(genderSelect).getByRole("button");
    fireEvent.mouseDown(genderSelectButton);
    const maleButton = screen.getByText("Male");
    fireEvent.click(maleButton);
    const input = within(genderSelect).queryByDisplayValue("male");
    expect(input).toBeInTheDocument();

    testNumberInput("salary-input", 30000);
    testNumberInput("employee-pct-input", 5);
    testNumberInput("employer-pct-input", 4);
    testNumberInput("planned-retire-age-input", 60);
    testNumberInput("current-pot-value-input", 10000);

    const finalPotValue = screen.getByTestId("final-pot-value");
    expect(finalPotValue).toBeInTheDocument();
    expect(finalPotValue).toHaveTextContent("£ 156121");
  });
});
