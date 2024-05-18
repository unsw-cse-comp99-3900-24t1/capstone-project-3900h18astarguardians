/* eslint-disable space-before-function-paren */
import { createContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { useSnackbar } from "notistack";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

const UserContext = createContext();

const App = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleBar = (
    msg: string,
    variant: "error" | "success" | "warning" | "info" | "default"
  ) => enqueueSnackbar(msg, { variant });

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ handleBar }}>
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
