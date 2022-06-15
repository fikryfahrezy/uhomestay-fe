// Ref: next.js/examples/with-iron-session
// https://github.com/vercel/next.js/tree/canary/examples/with-iron-session

import type { NextApiRequest, NextApiResponse } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { withIronSessionApiRoute } from "iron-session/next";
import jwt from "jsonwebtoken";
import User from "@/model/user";
import { sessionOptions } from "@/lib/session";
import fetchJson from "@/lib/fetchJson";

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
      `${process.env.MAIN_API_HOST_URL}/api/v1/login/admins`,
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

    const admin = { token, uid: decoded.uid, isLoggedIn: true };

    req.session.admin = new User(true, decoded.uid, "");
    await req.session.save();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
