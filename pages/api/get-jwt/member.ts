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
  const { identifier } = await req.body;

  if (!identifier) {
    res.status(500).json({ message: "identifier required" });
    return;
  }

  try {
    const {
      data: { token },
    } = await fetchJson<{ data: { token: string } }>(
      `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/get-member-jwt/${identifier}`,
      {
        method: "PATCH",
      }
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY ?? ""
    ) as JwtPayload;
    const user = new User({
      token,
      isLoggedIn: true,
      uid: decoded.uid,
      isAdmin: decoded["is_admin"],
      avatarUrl: "",
      login: decoded.uid,
    });

    req.session.user = user;

    await req.session.save();
    res.json(user.prop);
  } catch (error) {
    res.status(500).json((error as FetchError).data);
  }
}
