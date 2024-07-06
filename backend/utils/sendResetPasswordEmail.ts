// import { sendEmail } from "./sendEmail";

// export const sendResetPasswordEmail = async (
//   name: string,
//   email: string,
//   passwordToken: string,
//   origin: string
// ) => {
//   const url = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
//   const message = `<h4>Hello ${name} </h4> <a href='${url}'>Click on this link to reset your password!</a>`;

//   const subject = `Reset Password email for Auth Workflow`;
//   await sendEmail(email, message, subject);
// };
