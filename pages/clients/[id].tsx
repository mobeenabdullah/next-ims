import { FC, useState, useEffect } from "react";
import { Grid, Typography, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from '@mui/material/Box';
import styles from '../../components/client-form.module.scss';
import { useCookies } from "react-cookie";
import Header from "../../components/Header";
import Protected from "../../components/protectedRoutes";
import {getData, updateData} from '../../features/thunks/thunks';
import ClientForm from "../../components/clientForm";

const Client: FC = (props: any) => {
  const [cookies] = useCookies(["authToken"]);
  const clientDetail = {
    name: props.client.name,
    email: props.client.email,
    companyName: props.client.companyDetails?.name,
    iban: props.client.iban,
    vat: props.client.companyDetails?.vatNumber,
    address: props.client.companyDetails?.address,
    registrationNumber: props.client.companyDetails?.regNumber,
    swift: props.client.swift,
  }
  const userId = props.client.user_id;
  const id = props.client.id;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      setErrorMessage("");
      setSuccessMessage("");
      clearTimeout(timer);
    }, 3000);
  }, [isError, successMessage]);

  const handleUpdateClient = async (updatedClient) => {
    try{
      setIsLoading(true);
      const response = await updateData('clients', {...updatedClient, user_id: userId, id: id}, cookies.authToken);
      setIsLoading(false);
      setErrorMessage('');
      setIsError(false);
      setSuccessMessage('Client updated successfully!');
    } catch(error) {
      if (error.code === "ERR_NETWORK") {
        setErrorMessage(error.message);
      } else if (error.status === 500) {
        setErrorMessage("No internet connectivity");
      } else {
        setIsLoading(false);
        setErrorMessage(error.response.data);
      }
    }
  }

  return (
    <Protected>
      <Header />
      <Box className={styles.wrapper}>
        <Grid
          container
          rowSpacing={1}
          alignItems="stretch"
          columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
          sx={{ flexDirection: {xs: 'column', sm: 'column', md: 'row', lg: 'row'}, gap: {xs: "30px", sm: "30px", md: '30px', lg: 'inherit'}}}            
        >
          <Grid item xs={6} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}, display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}}}>
            <Stack className={styles.login_image}></Stack>
          </Grid>
          <Grid item xs={6} className={styles.login_form} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}}} display="flex" alignItems="center">
            <Stack className={styles.paper} sx={{maxWidth: {xs: "100%", sm: "100%"}, paddingBottom: "2rem"}}>
              <Stack spacing={2} sx={{width: '100%',}}>
                {isError && (
                  <Alert severity="error">{errorMessage}</Alert>
                )}
                {!isError && successMessage && (                
                  <Alert severity="success">{successMessage}</Alert>                
                )}
              </Stack>
              <Stack spacing={2}>
                <Stack spacing={1} sx={{ textAlign: "center" }}>
                  <Typography component="h1" variant="h4">Create client</Typography>
                </Stack>
              </Stack>
                <ClientForm
                  title="Edit client"
                  handleSubmitClient={handleUpdateClient}
                  loading={isLoading}
                  error={isError}
                  errorMessage={errorMessage}
                  clientData={clientDetail}
                />
                </Stack>
          </Grid>
        </Grid>
      </Box>
    </Protected>
  );
};
  
export async function getServerSideProps(context) {
  const { params } = context;
  const token = context.req.cookies.authToken;
  let client = {};
  let error = '';
  try{
    const response: any = await getData(`clients/${params.id}`, token, {});
    client = response.data.client;
  } catch(error) {
    if (error.code === "ERR_NETWORK") {
      error = error.message;
    } else if (error.status === 500) {
      error = "No internet connectivity";
    } else {
      error = error.response.data;
    }
  }

  return {
    props: {
      client : client,
      errorMessage: error
    },
  };
}

export default Client;