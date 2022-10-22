import { FC, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Header from "../../components/Header";
import Protected from '../../components/protectedRoutes';
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import ClientForm from '../../components/clientForm';
import { createData } from "../../features/thunks/thunks";
import { Grid, Typography, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from '@mui/material/Box';
import styles from './client-form.module.scss';

const CreateClient: FC = () => {
  const [cookies] = useCookies(["authToken"]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAppSelector((state: RootState) => state.user.user_id);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const clientDetail = {
    name: "",
    email: "",
    companyName: "",
    iban: "",
    vat: "",
    address: "",
    registrationNumber: "",
    swift: "",
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      setErrorMessage("");
      setSuccessMessage("");
      clearTimeout(timer);
    }, 3000);
  }, [isError, successMessage]);

  const handleCreateClient = async (data : any) => {
    const clientData = {...data, userId: userId};
    
    try {
      setIsLoading(true);
      const response : any = await createData('clients', clientData, cookies.authToken);
      if (response && response.status === 200) {
        setIsLoading(false);
        setSuccessMessage("Client created successfully!");
        setErrorMessage("");
        setIsError(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setSuccessMessage("");
      setIsError(true);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage(error.message);
      } else if (error.status === 500) {
        setErrorMessage("No internet connectivity");
      } else {
        setErrorMessage(error.response.data);
      }
    }
  };

  return (
    <Protected >
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
                  title='Create client'
                  handleSubmitClient={handleCreateClient}
                  loading={isLoading}
                  clientData={clientDetail}
                  successMessage={successMessage}
                />
              </Stack>
          </Grid>
        </Grid>
      </Box>
    </Protected>
  );
};

export default CreateClient;
