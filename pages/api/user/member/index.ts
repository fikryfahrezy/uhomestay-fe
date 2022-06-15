// Ref: next.js/examples/with-iron-session
// https://github.com/vercel/next.js/tree/canary/examples/with-iron-session
import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import User from "@/model/user";
import { sessionOptions } from "@/lib/session";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.member) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.member,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      avatarUrl: "",
      login: "",
    });
  }
}
