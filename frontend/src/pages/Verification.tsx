import { FormEvent, useEffect } from "react";
import { useGlobalContext } from "../utils/context";
import { request } from "../utils/axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const Verification = () => {
  const { displayError, displaySuccess, email } = useGlobalContext();

  const { verify } = useParams<{ verify: string}>();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const verifyingEmail = queryParams.get('email');
  console.log(verifyingEmail);

  const navigate = useNavigate();

  
  const handleVerification = async (email: string, token: string) => {
    try {
      const {
        data: { name },
      } = await request.post("/auth/verify-email", {
        email: email,
        verificationToken: token,
      });
      displaySuccess("Account successfully verified! Please login");
      navigate("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response!.data.msg;
        displayError(msg);
        navigate("/login");
      }
    }
  };

  handleVerification(verifyingEmail, token);
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Please wait, verifying your account...
      </Box>
    </Container>
  )
}

export default Verification;