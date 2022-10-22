import { FC, useState, useEffect } from "react";
import  Router  from "next/router";
import { useCookies } from "react-cookie";
import Loading from "../../components/Loading";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import jwt_decode from "jwt-decode";
import { addUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { createData, getData } from "../../features/thunks/thunks";
import styles from './sign-up.module.scss';
import Box from '@mui/material/Box';

const Register: FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["authToken"]);

  const userState = useAppSelector((state: RootState) => state.user);
  const userRegistered = useAppSelector(
    (state: RootState) => state.user.registeredUser
  );
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const [inValidName, setInValidName] = useState(false);
  const [inValidEmail, setInValidEmail] = useState(false);
  const [inValidEmailMessage, setInValidEmailMessage] = useState("");
  const [inValidPassword, setInValidPassword] = useState(false);
  const [inValidPasswordMessage, setInValidPasswordMessage] = useState("");
  const [inValidConfirmPassword, setInValidConfirmPassword] = useState(false);
  const [inValidConfirmPasswordMessage, setInValidConfirmPasswordMessage] =
    useState("");
  const [isloggedIn, setIsloggedIn] = useState(false);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      setErrorMessage("");
      setIsError(false);
      clearTimeout(timer);
    }, 3000);
  }, [isError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailValidRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (name === "") {
      setInValidName(true);
      return;
    } else {
      setInValidName(false);
    }
    if (email === "") {
      setInValidEmail(true);
      setInValidEmailMessage("Name is required!");
      return;
    } else {
      setInValidEmail(false);
    }
    if (!email.match(emailValidRegex)) {
      setInValidEmail(true);
      setInValidEmailMessage("Email format is invalid!");
      return;
    } else {
      setInValidEmail(false);
      setInValidEmailMessage("");
    }
    if (password.length < 5 || password.length > 16) {
      setInValidPassword(true);
      setInValidPasswordMessage("Password Must be 5-16 Character Long!");
      return;
    } else {
      setInValidPassword(false);
      setInValidPasswordMessage("");
    }
    if (password !== confirmpassword) {
      setInValidPassword(true);
      setInValidConfirmPassword(true);
      setInValidConfirmPasswordMessage("Password not match!");
      setInValidPasswordMessage("Password not match!");
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmpassword,
    };

    try {
      setIsLoading(true);
      const registeredUser = await createData('register', user, '');
      if (registeredUser && registeredUser.status === 200) {
        dispatch(
          addUser({
            ...userState,
            registeredUser: true,
            signUpMessage: "Signup Successfuly!",
          })
        );
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsError(true);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage(error.message);
      }
      if (error.status === 500) {
        setErrorMessage("No internet connectivity");
      } else {
        setErrorMessage(error.response.data);
      }
      setIsLoading(false);
    }
  };

  if (userRegistered) {
      Router.push('/login');
  }

  // redirect to dashboard if logged in
  if (isloggedIn) {
      Router.push('/');
  }

  return (
    <Box className={styles.wrapper}>
      <Grid
        container
        rowSpacing={1}
        alignItems="stretch"
        columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
        sx={{ flexDirection: {xs: 'column-reverse', sm: 'column-reverse', md: 'row', lg: 'row'}, gap: {xs: "30px", sm: "30px", md: '30px', lg: 'inherit'}}}            
      >
        <Grid item xs={6} className={styles.login_form} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}}}  display="flex" alignItems="center">
          <Stack className={styles.paper}  sx={{maxWidth: {xs: "100%", sm: "100%"}}}>
            <Stack spacing={2}>
              {isError && (
                <Stack sx={{ width: "100%" }} my={2}>
                  <Alert severity="error">{errorMessage}</Alert>
                </Stack>
              )}
              <Stack
                className={styles.avatar_alignment}
                sx={{ display: "flex", alignItems: "center" }}
                spacing={1}
              >
                <Avatar className={styles.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
              </Stack>
              <Stack spacing={1} sx={{ textAlign: "center" }}>
                <Typography component="h1" variant="h5">
                  Register
                </Typography>
              </Stack>
            </Stack>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Typography
                component="p"
                color="error"
                data-test="form-error"
              ></Typography>
              <TextField
                error={inValidName ? true : false}
                helperText={inValidName ? "Name is required!" : ""}
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                data-test="name"
              />
              <Typography component="p" color="error" data-test="name-error"></Typography>

              <TextField
                error={inValidEmail ? true : false}
                helperText={inValidEmail ? inValidEmailMessage : ""}
                variant="outlined"
                margin="normal"
                fullWidth
                name="email"
                label="Email"
                id="email"
                onChange={(e: any) => setEmail(e.target.value)}
                data-test="email"
              />
              <Typography component="p" color="error" data-test="email-error"></Typography>
              <TextField
                error={inValidPassword ? true : false}
                helperText={inValidPassword ? inValidPasswordMessage : ""}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                data-test="password"
              />
              <Typography component="p" color="error" data-test="password-error"></Typography>

              <TextField
                error={inValidConfirmPassword ? true : false}
                helperText={
                  inValidConfirmPassword ? inValidConfirmPasswordMessage : ""
                }
                variant="outlined"
                margin="normal"
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="current-password"
                onChange={(e) => setConfirmpassword(e.target.value)}
                data-test="confirm-password"
              />
              <Typography
                component="p"
                color="error"
                data-test="confirm-password-error"
              ></Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={styles.submit}
                disabled={isLoading ? true : false}
              >
                {isLoading ? <Loading /> : "Register"}
              </Button>
              <Grid
                container
                sx={{ padding: "20px", justifyContent: "center" }}
              >
                <Grid item display="flex" sx={{ gap: "10px" }}>
                  <Typography component="p" variant="body2">
                    You already have account?
                  </Typography>
                  <Link href="/login">Sign In</Link>
                </Grid>
              </Grid>
            </form>
          </Stack>
        </Grid>
        <Grid item xs={6} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}, display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}}}>
          <Stack className={styles.login_image}></Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export async function getServerSideProps({req, res}) { 

  const response = await getData('me', req.cookies.authToken, {});
  try{
    if (response.status === 200) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };   
    }
  }catch {
    return {
      props: {},
    };  
  }
}


export default Register;
