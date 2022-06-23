import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type CashflowOut = {
  id: number;
  date: string;
  note: string;
  type: string;
  idr_amount: string;
  prove_file_url: string;
};

export type CashflowRes = {
  total_cash: string;
  income_cash: string;
  outcome_cash: string;
  cashflows: CashflowOut[];
};

export type DocumentOut = {
  id: number;
  name: string;
  type: string;
  url: string;
  dir_id: number;
  is_private: boolean;
};

export type MemberOut = {
  id: string;
  username: string;
  name: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
  profile_pic_url: string;
  is_admin: boolean;
  is_approved: boolean;
};

export type DuesOut = {
  id: number;
  date: string;
  idr_amount: string;
};

export type BlogOut = {
  id: number;
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  slug: string;
  created_at: string;
};

export type PositionOut = {
  id: number;
  name: string;
  level: number;
};

export type LatestHistoryRes = {
  id: string;
  content: string;
  content_text: string;
};

export type MembersDuesOut = {
  id: number;
  member_id: string;
  status: string;
  name: string;
  profile_pic_url: string;
};

export type FindOrgPeriodGoalRes = {
  id: number;
  vision: string;
  vision_text: string;
  mission: string;
  mission_text: string;
};

export type StructureMemberOut = {
  id: string;
  name: string;
  profile_pic_url: string;
};

export type StructurePositionOut = {
  id: number;
  name: string;
  level: number;
  members: StructureMemberOut[];
};

export type StructureRes = {
  id: number;
  start_date: string;
  end_date: string;
  positions: StructurePositionOut[];
  vision: string;
  mission: string;
};

export type PeriodRes = {
  id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type PrivateRes = {
  documents: DocumentOut[];
  members: MemberOut[];
  cashflow: CashflowRes;
  dues: DuesOut;
  blogs: BlogOut[];
  positions: PositionOut[];
  latest_history: LatestHistoryRes;
  member_dues: MembersDuesOut[];
  org_period_goal: FindOrgPeriodGoalRes;
  active_period: PeriodRes;
};

type UsePrivateDashboardData = {
  data: PrivateRes;
};

export const usePrivateDashboardQuery = <
  D = UsePrivateDashboardData,
  E = FetchError
>(
  token: string,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "dashboardPrivateQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dashboard/private`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token ? token : ""}`,
          },
        }
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

type PublicRes = {
  documents: DocumentOut[];
  blogs: BlogOut[];
  latest_history: LatestHistoryRes;
  org_period_structures: StructureRes;
};

type UsePublicDashboardData = {
  data: PublicRes;
};

export const useDashboardQuery = <D = UsePublicDashboardData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "dashboardQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dashboard`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
