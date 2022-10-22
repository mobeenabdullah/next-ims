import { FC, useState, useEffect } from "react";
import Router from "next/router";
import { useCookies } from "react-cookie";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import styled from "styled-components";
import { Button, TextField, Grid, Typography, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addUser } from "../../features/user/userSlice";
import { RootState } from "../../store/store";
import { getData, updateData } from "../../features/thunks/thunks";
import Protected from "../../components/protectedRoutes";
import Box from '@mui/material/Box';
import styles from './company-detail.module.scss';

const CompanyDetail: FC = (props : any) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state: RootState) => state.user);
  const userCompanyDetail = useAppSelector((state: RootState) => state.user.companyDetails);
  const [cookies] = useCookies(["authToken"]);
  const [name, setName] = useState(props.companyDetails.name);
  const [address, setAddress] = useState(props.companyDetails.address);
  const [iban, setIban] = useState(props.companyDetails.iban);
  const [vat, setVat] = useState(props.companyDetails.vatNumber);
  const [registrationNumber, setRegistrationNumber] = useState(props.companyDetails.regNumber);
  const [swift, setSwift] = useState(props.companyDetails.swift);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [invalidVat, setInvalidVat] = useState(false);
  const [invalidRegistrationNumber, setInvalidRegistrationNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
      clearTimeout(timer);
    }, 3000);
  }, [errorMessage, successMessage, cookies.authToken]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (name === "" || name.length < 3 || name.length > 16) {
      setInvalidName(true);
      return;
    } else {
      setInvalidName(false);
    }

    if (address === "") {
      setInvalidAddress(true);
      return;
    } else {
      setInvalidAddress(false);
    }

    if (vat === "") {
      setInvalidVat(true);
      return;
    } else {
      setInvalidVat(false);
    }

    if (registrationNumber === "") {
      setInvalidRegistrationNumber(true);
      return;
    } else {
      setInvalidRegistrationNumber(false);
    }

    const companyData = {
      name: name,
      address: address,
      vatNumber: vat,
      regNumber: registrationNumber,
      iban: iban,
      swift: swift,
    };

    try {
      setIsLoading(true);
      const userUpdated = await updateData('me/company', companyData, cookies.authToken);
      setIsLoading(false);

      if(userCompanyDetail.name) {
        setIsUpdated(false);
        setSuccessMessage("Successfully company details updated!");
      } else {
        setIsUpdated(true);
      }
      
      dispatch(
        addUser({
          ...userState,
          user_id: userUpdated.data.user.id,
          name: userUpdated.data.user.name,
          email: userUpdated.data.user.email,
          companyDetails: userUpdated.data.user.companyDetails
        })
      );

    } catch (error: any) {
      setIsLoading(false);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage(error.message);
      } else if (error.status === 500) {
        setErrorMessage("No internet connectivity");
      } else {
        setErrorMessage(error.response.data);
      }
    }
  };

  if(isUpdated) {
    Router.push('/');
  }

  return (
    <Protected>
      <Header />
      <Box className={styles.wrapper}>
        <Grid
          container
          rowSpacing={1}
          alignItems="center"
          columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
          sx={{ flexDirection: {xs: 'column', sm: 'column', md: 'row', lg: 'row'}, gap: {xs: "30px", sm: "30px", md: 'inherit', lg: 'inherit'}}}            
        >
          <Grid item xs={6} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}, display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}}}>
            <Stack className={styles.login_image}></Stack>
          </Grid>
          <Grid item xs={6} className={styles.login_form} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}}}  display="flex" alignItems="center">
            <Stack className={styles.paper} sx={{maxWidth: {xs: "100%", sm: "100%"}, paddingBottom: {xs: '2rem', sm: '2rem'}}}>
              {errorMessage && (
                <Stack sx={{ width: "100%" }} my={2}>
                  <Alert severity="error">{errorMessage}</Alert>
                </Stack>
              )}
              {successMessage && (
                <Stack sx={{ width: "100%" }} my={2}>
                  <Alert severity="success">{successMessage}</Alert>
                </Stack>
              )}

              <Stack spacing={2}>
                <Stack spacing={1} sx={{ textAlign: "center" }}>
                  <Typography component="h1" variant="h4">
                    Lets Get Started
                  </Typography>
                  <Typography component="p">
                    First, we need some information
                  </Typography>
                </Stack>
              </Stack>

              <form className={styles.form} noValidate onSubmit={handleSubmit}>
                <Typography
                  component="p"                  
                  data-test="success-message"
                ></Typography>
                <TextField
                  error={invalidName ? true : false}
                  helperText={invalidName ? "Company name must be 3-16 character long!" : ""}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="company_name"
                  label="Company Name"
                  name="company_name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  data-test="company-name"
                />
                <Typography
                  component="p"
                  color="error"
                  data-test="company-name-error"
                ></Typography>
                <TextField
                  error={invalidAddress ? true : false}
                  helperText={
                    invalidAddress ? "Company address is required!" : ""
                  }
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="company_address"
                  label="Company Address"
                  name="company_address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  data-test="company-address"
                />
                <Typography
                  component="p"
                  color="error"
                  data-test="company-address-error"
                ></Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="company_iban"
                  label="IBAN"
                  name="company_iban"
                  onChange={(e) => setIban(e.target.value)}
                  value={iban}
                  data-test="company-iban"
                />
                <Typography
                  component="p"
                  color="error"
                  data-test="company-iban-error"
                ></Typography>
                <TextField
                  error={invalidVat ? true : false}
                  helperText={invalidVat ? "Vat number is required!" : ""}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="vat_number"
                  label="VAT Number"
                  name="vat_number"
                  type="number"
                  onChange={(e) => setVat(e.target.value)}
                  value={vat}
                  data-test="company-vat"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Typography
                  component="p"
                  color="error"
                  data-test="company-vat-error"
                ></Typography>
                <TextField
                  error={invalidRegistrationNumber ? true : false}
                  helperText={
                    invalidRegistrationNumber
                      ? "Registration number is required!"
                      : ""
                  }
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="registry_number"
                  label="Registry Number"
                  name="registry_number"
                  type="number"
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  value={registrationNumber}
                  data-test="company-reg-number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Typography
                  component="p"
                  color="error"
                  data-test="company-reg-error"
                ></Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="swift"
                  label="SWIFT"
                  name="swift"
                  onChange={(e) => setSwift(e.target.value)}
                  value={swift}
                  data-test="company-swift"
                />
                <Typography
                  component="p"
                  color="error"
                  data-test="company-swift-error"
                ></Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={styles.submit}
                  disabled={isLoading ? true : false}
                >
                  {isLoading ? <Loading /> : "submit"}
                </Button>
              </form>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Protected>
  );
};

export async function getServerSideProps(context) {
  const token = context.req.cookies.authToken || '';
  const response = await getData('me', token, {});
  if (response.status === 200 && response.data.companyDetails !== null) {
    const companyDetails = response.data.companyDetails;
    return {
      props : {
        companyDetails: companyDetails
      }
    }
  }

  return {
    props : {
      companyDetails: {
        name: "",
        address: "",
        vatNumber: "",
        regNumber: "",
        iban: "",
        swift: ""
      }
    }
  }

}

const Wrapper = styled.section`
  height: calc(100vh - 8%);
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 2%;
  .size {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .paper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar {
    background-color: #1976d2;
  }
  .form {
    width: 100%;
  }
  .submit {
    margin-top: 1rem;
    padding: 1rem;
  }
  .login_image {
    height: 85vh;
    border-radius: 16px;
    overflow: hidden;
    background-image: url("company.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .login_image li {
    height: 100% !important;
  }
  .login_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .login_form .paper {
    max-width: 50%;
    width: 100%;
    margin: 0 auto;
  }
  @media screen and (max-width: 992px) {
    padding: 2rem;
    align-items: start;
    .login_image {
      height: 500px;
    }    
    .login_form .paper {
      max-width: 80%;
    }
  }
  @media screen and (max-width: 767px) {
    .login_image {
      height: 300px;
      width: 100%;
    }
    .login_form .paper {
      max-width: 100%;
    }
  }
`;

export default CompanyDetail;
