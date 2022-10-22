import { FC, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Header from "../../../components/Header";
import Protected from "../../../components/protectedRoutes";
import { useAppSelector } from "../../../store/hooks";
import { Grid, Typography, Stack, Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import { RootState } from "../../../store/store";
import InvoiceForm from "../../../components/invoiceForm";
import { getData, createData } from "../../../features/thunks/thunks";
import styles from '../../../components/invoice-form.module.scss';

const CreateInvoice: FC = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(["authToken"]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userId = useAppSelector((state: RootState) => state.user.user_id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      setErrorMessage("");
      setSuccessMessage("");
      clearTimeout(timer);
    }, 3000);
  }, [isError, successMessage]);

  const handleSubmitInvoice = async (data) => {
    const invoiceData = {...data, user_id: userId};
    
    try {
      setIsLoading(true);
      const response : any = await createData('invoices', invoiceData, cookies.authToken);
      if (response && response.status === 200) {
        setIsLoading(false);
        setSuccessMessage("Invoice created successfully!");
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
        sx={{ flexDirection: {xs: 'column', sm: 'column', md: 'row', lg: 'row'}, gap: {xs: "30px", sm: "30px", md: 'inherit', lg: 'inherit'}}}                
        >
        <Grid item xs={6} sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}, display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}}}>
            <Stack className={styles.login_image}></Stack>
        </Grid>
        <Grid item xs={6} className={styles.login_form}  sx={{maxWidth: {xs: "100vw", sm: "100vw"}, width: {xs: '100%', sm: "100%"}}}  display="flex" alignItems="center">
            <Stack className={styles.paper} sx={{maxWidth: {xs: "100%", sm: "100%"}, paddingBottom: {xs: '2rem', sm: '2rem'}}}>
            <Stack spacing={2} sx={{width: '100%',}}>
                {isError && (
                    <Alert severity="error">{errorMessage}</Alert>
                )}
                {!isError && successMessage && (      
                    <Alert severity="success" >{successMessage}</Alert>                
                )}
            </Stack>
            
            <Stack spacing={2}>
                <Stack spacing={1} sx={{ textAlign: "center" }}>
                <Typography component="h1" variant="h4">
                    Create Invoice
                </Typography>
                </Stack>
            </Stack>
              <InvoiceForm
                  submitInvoice={handleSubmitInvoice}
                  loading={isLoading}
                  error={isError}
                  errorMessage={errorMessage}
                  successMessage={successMessage}
                  clients={props.clientsName}
              />
              </Stack>
            </Grid>
            </Grid>
        </Box>
    </Protected>
  );
};

export async function getServerSideProps(context) {
  const token = context.req.cookies.authToken || '';
  let errorMessage = '';
  let clientsNames = [];

  try {
    const clientsList = await getData('clients/names', token, {});
    if(clientsList.data.clients.length > 0) {
        let clientsArray = clientsList.data.clients.map((item : any) => {
          return {
            id: item.id,
            label: item.companyName
          };
        });
        clientsNames = clientsArray;
    }
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") {
      errorMessage = error.message;
    }
    if (error.status === 500) {
      errorMessage = "No internet connectivity";
    } else {
      errorMessage = error.response.data;
    }
  }

  return {
    props: {
      clientsName: clientsNames,
      errorMessage: errorMessage
    }
  };
}

export default CreateInvoice;
