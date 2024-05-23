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
};
export const MyGlobalContext = createContext<GlobalContent>({
  displayError: () => {},
  displaySuccess: () => {},
  displayWarning: () => {},
  displayInfo: () => {},
  handleToken: () => {},
  removeToken: () => {},
  token: null,
});
export const useGlobalContext = () => useContext(MyGlobalContext);
