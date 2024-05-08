import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import {
  PensionCalculatorReturn,
  usePensionCalculator,
} from "../hooks/usePensionCalculator";
import { useFormState } from "./FormStateProvider";

type PensionStateContextType = {
  result: PensionCalculatorReturn;
};

const PensionStateContext = createContext<PensionStateContextType>({
  result: null,
});

type PensionStateProviderProps = {
  children: ReactNode;
};

export const PensionStateProvider: FC<PensionStateProviderProps> = ({
  children,
}) => {
  const { parsedForm } = useFormState();
  const result = useMemo(() => {
    return usePensionCalculator(parsedForm);
  }, [parsedForm]);
  return (
    <PensionStateContext.Provider value={{ result }}>
      {children}
    </PensionStateContext.Provider>
  );
};

export const usePensionState = () => {
  return useContext(PensionStateContext);
};
