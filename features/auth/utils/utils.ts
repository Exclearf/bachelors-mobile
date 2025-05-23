import { jwtDecode, JwtPayload } from "jwt-decode";

import { User } from "../types/types";

export const getTokenExp = (token: string): number | null => {
  try {
    const { exp } = jwtDecode<{ exp: number } & JwtPayload>(token);
    return typeof exp === "number" ? Math.max(exp, 5 * 60 * 1000) : null;
  } catch {
    return null;
  }
};

export const extractUser = (user: any): User => ({
  name: user.user_metadata?.full_name ?? "Unknown",
  email: user.email ?? "Unknown",
  picture: user.user_metadata?.picture ?? null,
});
