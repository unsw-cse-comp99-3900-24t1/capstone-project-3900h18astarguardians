import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import { Request, Response } from "express";
import { createTokenUser } from "../utils";
import type { loginBodyI } from "../types";
import { randomBytes } from "crypto";

interface registerBodyI {
  name: string;
  email: string;
  password: string;
}
const register = async (req: Request, res: Response) => {
  // const {
  //   // no name needed
  //   body: { name, email, password },
  // }: { body: registerBodyI } = req;
  // const userExists = await User.findOne({ email });
  // const verificationToken = randomBytes(40).toString("hex");
  // await User.create({
  //   name,
  //   email,
  //   password,
  //   role,
  //   verificationToken,
  // });
  // await sendVerificationEmail(
  //   name,
  //   email,
  //   verificationToken,
  //   FRONT_END_DOMAIN_ORIGIN as string
  // );
  // res.status(StatusCodes.CREATED).json({
  //   msg: `Success! Please check your email to verify the account`,
  // });
};
const login = async (
  { body: { email } }: { body: loginBodyI },
  res: Response
) => {
  if (!email)
    throw new BadRequestError("both email and password must be provided");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("email was not found");

  const tokenUser = createTokenUser(user);
  console.log(tokenUser);
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out! " });
};
const verifyEmail = async (
  {
    body: { email, verificationToken },
  }: { body: { email: string; verificationToken: string } },
  res: Response
) => {
  // const user = await User.findOne({ email });
  // if (!user) throw new UnauthenticatedError(`email doesent exist`);
  // if (user.verificationToken !== verificationToken)
  //   throw new UnauthenticatedError(`verification token is invalid`);
  // user.isVerified = true;
  // user.verified = new Date(Date.now());
  // user.verificationToken = "";
  // await user.save();
  // res.status(StatusCodes.OK).json({ msg: "email verified" });
};
export { login, logout, verifyEmail };
