import { FC } from "react";
import Header from "../components/Header";
import { Container } from "@mui/system";
import DashboardClients from "../components/DashboardClients";
import DashboardInvoices from "../components/DashboardInvoices";
import { Grid } from "@mui/material";
import { getData } from "../features/thunks/thunks";
import Protected from "../components/protectedRoutes";

const HomePage: FC = (props) => {
  return (
    <Protected>
      <Header />
      <Container maxWidth="xl">
        <Grid
          container
          rowSpacing={1}
          alignItems="start"
          columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
        >
          <Grid item xs={12} sm={12} md={6}>
            <DashboardClients clientsList={props.clients} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <DashboardInvoices invoiceList={props.invoices} />
          </Grid>
        </Grid>
      </Container>
    </Protected>
  );
};

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  const token = req.cookies.authToken || '';

  const invoices = await getData('invoices', token, {});
  const clients = await getData('clients', token, {});

  return {
    props: {
      invoices: invoices.data.invoices.slice(-10).reverse(),
      clients: clients.data.clients.slice(-10).reverse()
    }
  };
}

export default HomePage;
