import { FUNCTION_ENDPOINT } from "../config";
import useSWR from "swr";

export const useVisitCounter = () => {
  return useSWR(FUNCTION_ENDPOINT, fetch);
};
