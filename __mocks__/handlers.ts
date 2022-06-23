/**
 * Ref:
 * https://github.com/mswjs/examples/blob/master/examples/with-jest/src/mocks/handlers.js
 */
import { rest } from "msw";

export const handlers = [
  rest.post("/api/login/member", (req, res, ctx) => {
    const { username } = req.body as any;

    return res(
      ctx.json({
        id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
        username,
        firstName: "John",
        lastName: "Maverick",
      })
    );
  }),
  rest.get("/api/user/member", (req, res, ctx) => {
    return res(
      ctx.json({
        id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
        firstName: "John",
        lastName: "Maverick",
      })
    );
  }),
];
