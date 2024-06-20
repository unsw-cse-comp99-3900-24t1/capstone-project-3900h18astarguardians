import { createContext, useContext } from "react";
import { tokenI } from "../App";
export type GlobalContent = {
  displayError: (s: string) => void;
  displaySuccess: (s: string) => void;
  displayWarning: (s: string) => void;
  displayInfo: (s: string) => void;
  handleToken: (token: tokenI) => void;
  removeToken: () => void;
  token: tokenI;
  handleOTP: (code: number) => void;
  removeOTP: () => void;
  otp: number;
  handleEmail: (email: string) => void;
  removeEmail: () => void;
  email: string;
};
export const MyGlobalContext = createContext<GlobalContent>({
  displayError: () => {},
  displaySuccess: () => {},
  displayWarning: () => {},
  displayInfo: () => {},
  handleToken: () => {},
  removeToken: () => {},
  token: null,
  handleOTP: () => {},
  removeOTP: () => {},
  otp: 0, 
  handleEmail: () => {},
  removeEmail: () => {},
  email: "",
});
export const useGlobalContext = () => useContext(MyGlobalContext);
