// Ref: next.js/examples/with-iron-session
// https://github.com/vercel/next.js/tree/canary/examples/with-iron-session

import type { NextApiRequest, NextApiResponse } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { withIronSessionApiRoute } from "iron-session/next";
import jwt from "jsonwebtoken";
import User from "@/model/user";
import { sessionOptions } from "@/lib/session";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { identifier, password } = await req.body;

  if (!identifier || !password) {
    res.status(500).json({ message: "identifier and password required" });
    return;
  }

  try {
    const {
      data: { token },
    } = await fetchJson<{ data: { token: string } }>(
      `${process.env.MAIN_API_HOST_URL}/api/v1/login/members`,
      {
        method: "POST",
        body: JSON.stringify({
          identifier,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const decoded = jwt.verify(
      token,
      process.env.SECRET_COOKIE_PASSWORD ?? ""
    ) as JwtPayload;
    const member = { token, uid: decoded.uid, isLoggedIn: true };

    req.session.member = new User(true, decoded.uid, "");
    await req.session.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
