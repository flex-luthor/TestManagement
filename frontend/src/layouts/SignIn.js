import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useCookies } from "react-cookie";
import { Switch, Route, Redirect } from "react-router-dom";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [roll, setRoll] = useState();
  const [password, setPassword] = useState();

  const handleRoll = e => {
    setRoll(e.target.value);
  };

  const handlePassword = e => {
    setPassword(e.target.value);
  };

  const submitLogIn = e => {
    e.preventDefault();
    const dataStudents = [{ Roll: "1234", Password: "password123" }];
    const dataAdmins = [{ Roll: "admin", Password: "admin@123" }];

    if (dataStudents.find(el => el.Roll === roll) !== undefined && dataStudents.find(el => el.Password === password) !== undefined) {
      console.log("Logged in as Student");
      setCookie('user', 'student', { path: '/' });
    }else if (dataAdmins.find(el => el.Roll === roll) !== undefined) {
      console.log("Logged in as Admin");
      setCookie('user', 'admin', { path: '/' });
    }else{
      alert("Invalid Login");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
          {cookies.user === 'student' || cookies.user  === 'admin' ? <Redirect to="/" />: null}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          TEST MANAGEMENT SYSTEM
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="roll"
            value={roll}
            onChange={handleRoll}
            label="Roll number"
            name="roll"
            autoFocus
            
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={handlePassword}
            name="password"
            label="Password"
            type="password"
            id="password"
            shrink
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={submitLogIn}
          >
            Sign In
          </Button>
          </form>
      </div>
    </Container>
  );
}
