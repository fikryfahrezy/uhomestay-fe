import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type AddHistoryIn = {
  content: string;
  content_text: string;
};

export const addHistory = async (data: AddHistoryIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/histories`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type LatestHistoryRes = {
  id: string;
  content: string;
  content_text: string;
};

type UseFindLatestHistoryData = {
  data: LatestHistoryRes;
};

export const useFindLatestHistory = <
  D = UseFindLatestHistoryData,
  E = FetchError
>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "findLatestHistory",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/histories`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
