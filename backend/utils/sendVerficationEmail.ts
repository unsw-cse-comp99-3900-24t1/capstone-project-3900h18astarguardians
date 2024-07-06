// import { sendEmail } from "./sendEmail";

// export const sendVerificationEmail = async (
//   name: string,
//   email: string,
//   verificationToken: string,
//   origin: string
// ) => {
//   const url = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
//   const message = `<h4>Hello ${name} </h4> <a href='${url}'>Click on this link to Verify!</a>`;

//   const subject = `Verification email for Auth Workflow`;
//   await sendEmail(email, message, subject);
// };
