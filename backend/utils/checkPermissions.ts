import { UnauthorizedError } from "../errors";
import { tokenUserI } from "../types";
export const checkPermissions = (
  { email, type }: tokenUserI,
  resourceUserId: string
) => {
  if (email === resourceUserId || type === "admin") return;

  throw new UnauthorizedError("user is not authorised to access this route");
};
