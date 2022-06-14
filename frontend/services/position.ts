import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type PositionOut = {
  id: number;
  name: string;
  level: number;
};

type UsePositionsQueryData = {
  data: PositionOut[];
};

export const usePositionsQuery = <D = UsePositionsQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "positionsQuery",
    async () => {
      const fetched = fetchJson<D>(
        "https://polar-badlands-14608.herokuapp.com/api/v1/positions"
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
        "https://polar-badlands-14608.herokuapp.com/api/v1/positions/levels"
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
    "https://polar-badlands-14608.herokuapp.com/api/v1/positions",
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/positions/${id}`,
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/positions/${id}`,
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
