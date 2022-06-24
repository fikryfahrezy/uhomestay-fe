/**
 * Ref:
 * https://github.com/mswjs/examples/blob/master/examples/with-jest/src/mocks/handlers.js
 */
import { rest } from "msw";

const user = {
  token: "blablabla",
  uid: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
  isLoggedIn: true,
};

const document = {
  id: 1,
  name: "",
  type: "",
  url: "http://string",
  dir_id: 0,
  is_private: false,
};

const documents = [document];

const blog = {
  id: 0,
  title: "",
  short_desc: "",
  thumbnail_url: "https://string",
  content: "",
  slug: "",
  created_at: "2022-01-02",
};

const blogs = [blog];

const latest_history = {
  id: 1,
  content: "",
  content_text: "",
};

const org_period_structures = {
  id: 1,
  start_date: "",
  end_date: "",
  positions: [],
  vision: "",
  mission: "",
};

const member = {
  id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
  username: "",
  name: "",
  wa_phone: "",
  other_phone: "",
  homestay_name: "",
  homestay_address: "",
  homestay_latitude: "",
  homestay_longitude: "",
  profile_pic_url: "",
  is_admin: "",
  is_approved: "",
};

const members = [member];

const cashflow = {
  total_cash: "",
  income_cash: "",
  outcome_cash: "",
  cashflows: [],
};

const dues = {
  id: 1,
  date: "",
  idr_amount: "",
};

const position = {
  id: 1,
  name: "",
  level: 1,
};

const positions = [position];

const member_d = {
  id: 1,
  member_id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
  status: "PAID",
  name: "",
  profile_pic_url: "http://localhost",
};

const member_dues = [member_d];

const org_period_goal = {
  id: 1,
  vision: "",
  vision_text: "",
  mission: "",
  mission_text: "",
};

const active_period = {
  id: 1,
  start_date: "",
  end_date: "",
  is_active: true,
};

export const handlers = [
  rest.post("/api/login/member", (req, res, ctx) => {
    return res(ctx.json(user));
  }),
  rest.get("/api/user/member", (req, res, ctx) => {
    return res(ctx.json(user));
  }),
  rest.post("/api/login/admin", (req, res, ctx) => {
    return res(ctx.json(user));
  }),
  rest.get("/api/user/admin", (req, res, ctx) => {
    return res(ctx.json(user));
  }),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dashboard`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          documents,
          blogs,
          latest_history,
          org_period_structures,
        })
      );
    }
  ),

  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dashboard/private`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          documents,
          blogs,
          latest_history,
          members,
          cashflow,
          dues,
          positions,
          member_dues,
          org_period_goal,
          active_period,
        })
      );
    }
  ),
];
