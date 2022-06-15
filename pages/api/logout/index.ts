import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

// type User = {
//   isLoggedIn: boolean;
//   [key: string]: unknown;
// };

// function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.json({ isLoggedIn: false, token: "" });
}
