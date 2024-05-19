import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { request } from "../config";
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
const Login = () => {
  const { handleBar } = useContext(UserContext);

  const navigate = useNavigate();
  const checkLoggedIn = async () => {
    try {
      await request.get("/users/showMe");
      handleBar("Successfully Registered", "success");
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    checkLoggedIn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check that passwords match HERE
    try {
      const data = new FormData(e.currentTarget);
      const {
        data: { user },
      } = await request.post("/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      });
      console.log(user);

      handleBar("Successfully Logged in", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response.data.msg;
      handleBar(msg, "error");
    }
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
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register" variant="body2">
                Dont have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
