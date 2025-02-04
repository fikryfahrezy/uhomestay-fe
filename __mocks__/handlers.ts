/**
 * Ref:
 * https://github.com/mswjs/examples/blob/master/examples/with-jest/src/mocks/handlers.js
 */
import { RequestHandler, rest } from "msw";

const user = {
  token: "blablabla",
  uid: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
  isLoggedIn: true,
};

const document = {
  id: 1,
  name: "",
  type: "file",
  url: "http://string",
  dir_id: 0,
  is_private: false,
};

const documents = [document];

const article = {
  id: 0,
  title: "",
  short_desc: "",
  thumbnail_url: "https://string",
  content: "",
  slug: "",
  created_at: "2022-01-02",
};

const articles = [article];

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
  profile_pic_url: "",
  is_admin: "",
  is_approved: true,
};

const members = [member];

const cashflows = [
  {
    id: 1,
    date: "",
    note: "",
    type: "income",
    idr_amount: "124",
    prove_file_url: "https://localhost:5000",
  },
  {
    id: 2,
    date: "",
    note: "",
    type: "outcome",
    idr_amount: "124",
    prove_file_url: "https://localhost:5000",
  },
];

const cashflowStat = {
  income_total: 0,
  outcome_total: 0,
  total_cash: "",
  income_cash: "",
  outcome_cash: "",
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
  status: "unpaid",
  name: "",
  profile_pic_url: "http://localhost",
  pay_date: "2022-02-01",
};

const member_dues = [member_d];

const dues_member = {
  date: "2022-01-01",
  dues_id: 1,
  id: 1,
  idr_amount: "1000",
  prove_file_url: "http://localhost",
  status: "unpaid",
  pay_date: "2022-01-01",
};

const dues_members = [dues_member];

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

const level = {
  level: 1,
};

const levels = [level];

const blog_detail = {
  id: 1,
  title: "",
  short_desc: "",
  thumbnail_url: "https://string",
  content: "",
  content_text: "",
  slug: "",
  created_at: "2022-01-02",
};

const period = {
  id: 1,
  start_date: "",
  end_date: "",
  is_active: true,
};

const periods = [period];

const idres = {
  id: 1,
};

const uidres = {
  id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
};

const image = {
  id: 0,
  name: "image name",
  url: "http://string",
  description: "description",
};

const images = [image];

export const handlers: RequestHandler[] = [
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
          articles,
          latest_history,
          org_period_structures,
          images,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dashboard/private`,
    (req, res, ctx) => {
      const { income_total, outcome_total, ...cashflow } = cashflowStat;
      return res(
        ctx.json({
          member_total: members.length,
          document_total: documents.length,
          blog_total: articles.length,
          position_total: positions.length,
          member_dues_total: member_dues.length,
          image_total: images.length,
          documents,
          articles,
          latest_history,
          members,
          cashflow,
          dues,
          positions,
          member_dues,
          org_period_goal,
          active_period,
          images,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 0,
            total: positions.length,
            positions,
          },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions/levels`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: levels,
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/positions/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            total: articles.length,
            cursor: 0,
            articles,
          },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: blog_detail,
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/image`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            url: "https://localhost:5000",
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cashflows,
            cursor: 0,
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows/stats`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            ...cashflowStat,
          },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 0,
            total: documents.length,
            documents,
          },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 0,
            total: documents.length,
            documents,
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/dir`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/file`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            id: 1,
          },
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/dir/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/file/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            dues: [dues],
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/:id/check`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            is_paid: false,
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/histories`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/histories`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: latest_history,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 0,
            total_dues: "",
            paid_dues: "",
            unpaid_dues: "",
            total: member_dues.length,
            dues: dues_members,
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/monthly/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/:id/members`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 0,
            dues_id: 0,
            total: member_dues.length,
            dues_date: "2020-01-01",
            dues_amount: "10000",
            paid_dues: "5000",
            unpaid_dues: "5000",
            member_dues,
          },
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/monthly/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.patch(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/monthly/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: "",
            total: members.length,
            members,
          },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            ...member,
            id_card_url: "http:/localhost:5000",
            positions,
            period_id: 1,
            period: "",
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: uidres,
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/register`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: uidres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: uidres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: uidres,
        })
      );
    }
  ),
  rest.patch(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: uidres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 1,
            total: periods.length,
            periods,
          },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/active`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: period,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/:id/structures`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            id: 1,
            start_date: "",
            end_date: "",
            positions: [
              {
                ...position,
                members: [
                  {
                    id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
                    name: "",
                    profile_pic_url: "http://localhost:5000",
                  },
                ],
              },
            ],
            vision: "",
            mission: "",
          },
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.patch(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/:id/status`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/goals`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/periods/:id/goal`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: org_period_goal,
        })
      );
    }
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/images/:id`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/images`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: idres,
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/images`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            cursor: 0,
            total: images.length,
            images,
          },
        })
      );
    }
  ),
];
