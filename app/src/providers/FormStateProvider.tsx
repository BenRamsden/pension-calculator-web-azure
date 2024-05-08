import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  defaultFormState,
  FormStateReducerAction,
  FormStateReducerState,
  useFormStateReducer,
} from "../reducers/FormStateReducer";
import {
  PensionCalculatorProps,
  PensionCalculatorPropsValidator,
} from "../hooks/usePensionCalculator";
import { useLocalStorage } from "usehooks-ts";
import dayjs, { Dayjs } from "dayjs";
import { ZodError } from "zod";

type FormStateContextType = {
  state: FormStateReducerState;
  parsedForm: PensionCalculatorProps;
  parseError: ZodError | null;
  dispatch: Dispatch<FormStateReducerAction>;
};

const FormStateContext = createContext<FormStateContextType>({
  state: { ...defaultFormState },
  parsedForm: null,
  parseError: null,
  dispatch: () => {},
});

type FormStateProviderProps = {
  children: ReactNode;
};

type PersistedFormState = Partial<FormStateReducerState> | null;

export const FormStateProvider: FC<FormStateProviderProps> = ({ children }) => {
  const [savedFormState, setSavedFormState] =
    useLocalStorage<PersistedFormState>("savedFormState", null);
  const [state, dispatch] = useFormStateReducer({
    savedFormState:
      savedFormState === null
        ? {}
        : {
            ...savedFormState,
            dob: dayjs(savedFormState.dob),
          },
  });
  useEffect(
    () => {
      if (!state.saveAnswers && savedFormState !== null) {
        console.log("Clearing saved form state");
        setSavedFormState(null);
        return;
      } else if (!state.saveAnswers) {
        return;
      }

      console.log("Saving form state");
      setSavedFormState({
        //Questions inputs
        dob: state.dob,
        gender: state.gender,
        salary: state.salary,
        employeePct: state.employeePct,
        employerPct: state.employerPct,
        plannedRetireAge: state.plannedRetireAge,
        currentPotValue: state.currentPotValue,
        saveAnswers: state.saveAnswers,
        //Assumptions inputs (partial)
        salaryProjectionEnabled: state.salaryProjectionEnabled,
        //Results inputs
        lumpSumPct: state.lumpSumPct,
        earlyDrawDownBiasPct: state.earlyDrawDownBiasPct,
      });
    },
    // Do not put savedFormState as a dep here, causes infinite loop
    [state, setSavedFormState]
  );
  const parseResult = useMemo(() => {
    return PensionCalculatorPropsValidator.safeParse(state);
  }, [state]);
  return (
    <FormStateContext.Provider
      value={{
        state,
        parsedForm: parseResult.success ? parseResult.data : null,
        parseError: parseResult.success ? null : parseResult.error,
        dispatch,
      }}
    >
      {children}
    </FormStateContext.Provider>
  );
};

export const useFormState = () => {
  return useContext(FormStateContext);
};
