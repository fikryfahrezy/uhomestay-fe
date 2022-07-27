import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import { useQuery, useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type PositionOut = {
  id: number;
  name: string;
  level: number;
};

type UsePositionsQueryData = {
  data: {
    total: number;
    cursor: number;
    positions: PositionOut[];
  };
};

export const usePositionsQuery = <D = UsePositionsQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "positionsQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions?limit=999`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useInfinitePositionsQuery = <
  D = UsePositionsQueryData,
  E = FetchError
>(
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    "positionsInfiniteQuery",
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type PositionLevelOut = {
  level: number;
};

type UsePositionLevelsQueryData = {
  data: PositionLevelOut[];
};

export const usePositionLevelsQuery = <
  D = UsePositionLevelsQueryData,
  E = FetchError
>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "positionLevelsQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions/levels`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type AddPositionIn = {
  name: string;
  level: number;
};

export const addPosition = async (data: AddPositionIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions`,
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

export type EditPositionIn = {
  name: string;
  level: number;
};

export const editPosition = async (id: number, data: EditPositionIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions/${id}`,
    {
      method: "PUT",
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

export const removePosition = (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions/${id}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};
