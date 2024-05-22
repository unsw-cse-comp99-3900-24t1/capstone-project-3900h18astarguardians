/* eslint-disable space-before-function-paren */
import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { useSnackbar } from "notistack";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
// @ts-expect-error no input needed
const UserContext = createContext();

type tokenI = {
  user: string;
  name: string;
  userId: string;
} | null;

const App = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [token, setToken] = useState<tokenI>(
    localStorage.getItem("token") && JSON.parse(localStorage.getItem("token")!)
  );

  const displayError = (msg: string) =>
    enqueueSnackbar(msg, { variant: "error" });

  const displaySuccess = (msg: string) =>
    enqueueSnackbar(msg, { variant: "success" });

  const displayWarning = (msg: string) =>
    enqueueSnackbar(msg, { variant: "warning" });

  const displayInfo = (msg: string) =>
    enqueueSnackbar(msg, { variant: "info" });

  const handleToken = (token: tokenI) => {
    setToken(token);
    localStorage.setItem("token", JSON.stringify(token));
  };
  const removeToken = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  return (
    <>
      <BrowserRouter>
        <UserContext.Provider
          value={{
            displayError,
            displaySuccess,
            displayWarning,
            displayInfo,
            handleToken,
            removeToken,
          }}
        >
          <ResponsiveAppBar isLoggedIn={false} />
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace={true} />} />
            <Route path="login" element={<Login />} />

            <Route path="*" element={<h1> Page Not Found</h1>} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
export { UserContext };
