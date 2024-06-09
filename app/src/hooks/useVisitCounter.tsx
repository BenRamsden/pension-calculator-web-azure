import { FUNCTION_ENDPOINT } from "../config";
import useSWR from "swr";
import fetch from "unfetch";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const useVisitCounter = ({ increment }: { increment: boolean }) => {
  return useSWR(`${FUNCTION_ENDPOINT}?increment=${increment}`, fetcher);
};
