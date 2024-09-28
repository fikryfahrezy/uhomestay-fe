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
      `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/login/members`,
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
      process.env.JWT_SECRET_KEY ?? ""
    ) as JwtPayload;
    const member = new User({
      token,
      isAdmin: decoded["is_admin"],
      isLoggedIn: true,
      uid: decoded.uid,
      avatarUrl: "",
      login: decoded.uid,
    });

    req.session.user = member;
    await req.session.save();
    res.json(member.prop);
  } catch (error) {
    res.status(500).json((error as FetchError).data);
  }
}
