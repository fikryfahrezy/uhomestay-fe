import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type PeriodRes = {
  id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type UsePeriodsQueryData = {
  data: PeriodRes[];
};

export const usePeriodsQuery = <D = UsePeriodsQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "periodsQuery",
    async () => {
      const fetched = fetchJson<D>(
        "https://polar-badlands-14608.herokuapp.com/api/v1/periods"
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
        "https://polar-badlands-14608.herokuapp.com/api/v1/periods/active"
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
        `https://polar-badlands-14608.herokuapp.com/api/v1/periods/${id}/structures`
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
  mission: string;
};

export const addPeriod = async (data: AddPeriodIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    "https://polar-badlands-14608.herokuapp.com/api/v1/periods",
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/periods/${id}`,
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/periods/${id}/status`,
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/periods/${id}`,
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

export type GoalIn = {
  vision: string;
  mission: string;
  org_period_id: number;
};

export const addGoal = async (data: GoalIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    "https://polar-badlands-14608.herokuapp.com/api/v1/periods/goals",
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
  mission: string;
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
        `https://polar-badlands-14608.herokuapp.com/api/v1/periods/${id}/goal`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
