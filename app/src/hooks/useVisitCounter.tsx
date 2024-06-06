import { FUNCTION_ENDPOINT } from "../config";
import useSWR from "swr";
import fetch from "unfetch";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const useVisitCounter = () => {
  return useSWR(FUNCTION_ENDPOINT, fetcher);
};
