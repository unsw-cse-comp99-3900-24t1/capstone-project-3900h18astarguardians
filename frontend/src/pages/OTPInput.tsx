import { FormEvent } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";

const OTPInput = () => {
  const { displayError, otp, removeOTP } = useGlobalContext();

  const navigate = useNavigate();
  
  const handleOTPSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("code") == otp) {
      removeOTP();
    }
    navigate("/reset-password");
  };

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          OTP Input
        </Typography>
        <Box component="form" noValidate onSubmit={handleOTPSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Please enter your email address"
                name="email"
                autoComplete="email"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Link
          </Button>
          <Typography component="text" variant="subtitle1" justifyContent="space-evenly">
            We have sent a code to your email
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default OTPInput;