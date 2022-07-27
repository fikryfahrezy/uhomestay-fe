import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import { useQuery, useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type PeriodRes = {
  id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type UsePeriodsQueryData = {
  data: {
    cursor: number;
    total: number;
    periods: PeriodRes[];
  };
};

export const usePeriodsQuery = <D = UsePeriodsQueryData, E = FetchError>(
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    "periodsQuery",
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

type UseFindActivePeriodData = {
  data: PeriodRes;
};

export const useFindActivePeriod = <
  D = UseFindActivePeriodData,
  E = FetchError
>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "findActivePeriod",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/active`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type StructureMemberOut = {
  id: string;
  name: string;
  profile_pic_url: string;
};

export type StructurePositonOut = {
  id: number;
  name: string;
  level: number;
  members: StructureMemberOut[];
};

export type StructureRes = {
  id: number;
  start_date: string;
  end_date: string;
  positions: StructurePositonOut[];
  vision: string;
  mission: string;
};

type UsePeriodStructureQueryData = {
  data: StructureRes;
};

export const usePeriodStructureQuery = <
  D = UsePeriodStructureQueryData,
  E = FetchError
>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["periodStructureQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/${id}/structures`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type MemberIn = {
  id: string;
};

export type PositionIn = {
  id: number;
  members: MemberIn[];
};

export type AddPeriodIn = {
  start_date: string;
  end_date: string;
  positions: PositionIn[];
  vision: string;
  vision_text: string;
  mission: string;
  mission_text: string;
};

export const addPeriod = async (data: AddPeriodIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods`,
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

export type EditPeriodIn = {
  start_date: string;
  end_date: string;
  positions: PositionIn[];
  vision: string;
  mission: string;
};

export const editPeriod = (id: number, data: EditPeriodIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/${id}`,
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

export type SwitchPeriodStatusIn = {
  is_active: boolean;
};

export const changePeriodStatus = async (
  id: number,
  data: SwitchPeriodStatusIn
) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export const removePeriod = async (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/${id}`,
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

export type AddGoalIn = {
  vision: string;
  vision_text: string;
  mission: string;
  mission_text: string;
  org_period_id: number;
};

export const addGoal = async (data: AddGoalIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/goals`,
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

export type FindOrgPeriodGoalRes = {
  id: number;
  vision: string;
  vision_text: string;
  mission: string;
  mission_text: string;
};

type UseFindPeriodGoalData = {
  data: FindOrgPeriodGoalRes;
};

export const useFindPeriodGoal = <D = UseFindPeriodGoalData, E = FetchError>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["findPeriodGoal", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/${id}/goal`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
