import { sendEmail } from "./sendEmail";

// export const sendVerificationEmail = async (
//   name: string,
//   email: string,
//   verificationToken: string,
//   origin: string
// ) => {
//   const from = "m.arsalah003@gmail.com";

//   const url = `${origin}/user/verify?token=${verificationToken}&email=${email}`;
//   const text = `<h4>Hello ${name} </h4> <a href='${url}'>Click on this link to Verify!</a>`;

//   const subject = `Verification email for Auth Workflow`;
//   await sendEmail({ text, from });
// };
