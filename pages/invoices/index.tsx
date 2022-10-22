import { FC } from "react";
import Header from "../../components/Header";
import { Container } from "@mui/system";
import InvoiceTable from "../../components/InvoiceTable";
import { Grid } from "@mui/material";
import { getData } from "../../features/thunks/thunks";
import Protected from "../../components/protectedRoutes";

const Invoices: FC = (props) => {
  return (
    <Protected>
      <Header />
      <Container maxWidth="xl">
        <Grid
          container
          rowSpacing={1}
          alignItems="center"
          columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <InvoiceTable invoiceList={props.invoices} total={props.total} />
          </Grid>
        </Grid>
      </Container>
    </Protected>
  );
};

export async function getServerSideProps(context) {
  const req = context.req;
  const query = context.query;
  const token = req.cookies.authToken || '';
  const limit = query.limit || 10;
  const page = query.page || 1;


  try{
    const filters = {
      page: page,
      sortBy: query.sortBy || '',
      sort: query.sortOrder || 'desc',
      clientId: query.clientId || '',
      offset: query.offset || (page * limit) - limit,
      projectCode: query.projectCode || ''
    }

    const invoices = await getData('invoices', token, filters);
    
    return {
      props: {
        invoices: invoices.data.invoices,
        total: invoices.data.total || 0
      }
    };
  } catch (error){
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  
}

export default Invoices;
