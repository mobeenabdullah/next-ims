import { FC, useRef, useState, useEffect } from "react";
import Router, {useRouter} from "next/router";
import { Grid, Stack, Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from "@mui/material/TableFooter";
import Alert from "@mui/material/Alert";
import Protected from "../../../components/protectedRoutes";
import styles from './view-invoice.module.scss';
import { getData } from "../../../features/thunks/thunks";

const ViewInvoice: FC = (props: any) => {
    const router = useRouter();
    const printDocument = useRef<HTMLInputElement | null>(null);

    const dateFormat = (format: string, timeStamp: any) => {
        let date;
        //parse the input date
        if(timeStamp) {
          date = new Date(timeStamp);
        } else {
          date = new Date();
        }
    
        //extract the parts of the date
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();    
    
        //replace the month
        format = format.replace("MM", month.toString().padStart(2,"0"));        
    
        //replace the year
        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2,2));
        }
    
        //replace the day
        format = format.replace("dd", day.toString().padStart(2,"0"));
    
        return format;
    }

    useEffect(() => {
      if(router.query.print) {
        const timer = setTimeout(() => {
            PrintInvoice();
          clearTimeout(timer);
        }, 1000);
      }
    }, []); 

  const PrintInvoice =  () =>{
      let documentToPrint = printDocument;
      if(documentToPrint){
        let printContents = documentToPrint.current.innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        Router.push(`/invoices/${router.query.id}/view`, `/invoices/${router.query.id}/view`, {shallow: true} )
        const printTimer = setTimeout(() => {
          window.print();
          document.body.innerHTML = originalContents;
          window.history.go(0);
          clearTimeout(printTimer);
        }, 1000);
      }
  }

  
  return (
    <Protected>
      <Box className={styles.invoice_wrapper} ref={printDocument} id="printablediv">
        <Container maxWidth="xl">
            <Grid
            container
            rowSpacing={1}
            alignItems="center"
            columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
            >
              <Stack spacing={2} sx={{width: '100%',}}>
                {props.errorMessage && (
                  <Alert severity="error" data-test='not-found-message'>{props.errorMessage}</Alert>
                )}
              </Stack>
              {!props.errorMessage &&  (
                <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{flexGrow: '1'}} display="flex" alignItems="start" justifyContent="space-between" pt={4} pb={4}>
                      <Box display="flex" alignItems="stretch" sx={{ gap: '20px'}} className="invoice_buttons">&nbsp;</Box>
                      <Box sx={{ maxWidth: "380px", width: "100%" }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: "20px"}} data-test="invoice-date">
                              <Typography variant="subtitle2" sx={{ fontWeight: "700", width: '70%' }}>Invoice Date:</Typography>
                              <Typography variant="subtitle2" sx={{ width: '70%'}} data-test='invoice-date'>{dateFormat('dd/MM/yyyy', props.invoice.date)}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: "20px"}} data-test="invoice-due-date">
                              <Typography variant="subtitle2"  sx={{ fontWeight: "700", width: '70%' }}>Invoice Due Date:</Typography>
                              <Typography variant="subtitle2" sx={{ width: '70%'}} data-test='invoice-due-date'>{dateFormat('dd/MM/yyyy', props.invoice.dueDate)}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: "20px"}} data-test="invoice-number">
                              <Typography variant="subtitle2"  sx={{ fontWeight: "700", width: '70%' }}>Invoice Number:</Typography>
                              <Typography variant="subtitle2" sx={{ width: '70%'}} data-test='invoice-number'>{props.invoice.invoice_number}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: "20px"}} data-test="invoice-project-code">
                              <Typography variant="subtitle2"  sx={{ fontWeight: "700", width: '70%' }}>Invoice Project Code:</Typography>
                              <Typography variant="subtitle2" sx={{ width: '70%'}} data-test='invoice-project-code'>{props.invoice.projectCode}</Typography>
                          </Box>
                      </Box>
                    </Box>
                    <Divider />
                    <Box>
                        <Box pt={4} pb={4}>
                            <Typography variant="h3" textAlign="center">Invoice</Typography>
                        </Box>  
                        <Box>
                        <TableContainer component={Paper}  className="table_wrapper">
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell variant="head" sx={{fontWeight:"700"}}>Description</TableCell>
                                    <TableCell  variant="head" padding="checkbox" align="left" sx={{fontWeight:"700", textAlign:"right", padding: "1rem"}}>Value</TableCell>                                    
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {props.invoice.meta && props.invoice.meta.items && props.invoice.meta.items.length && props.invoice.meta.items.map((row: any, index: number) => (
                                    <TableRow
                                    key={index}
                                    data-test={`invoice-item-${index}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                                    >
                                      <TableCell component="th" scope="row" data-test='invoice-item-description'>
                                          {row.description}
                                      </TableCell>
                                    <TableCell align="right" padding="checkbox" sx={{padding: "1rem"}} data-test='invoice-item-value'>{row.value}</TableCell>                                    
                                    </TableRow>
                                ))}
                                  <TableRow>
                                    <TableCell variant="head" sx={{fontWeight:"700", textAlign: "right", padding: "1rem"}}>
                                        <Typography variant="h6">Total Amount</Typography>
                                    </TableCell>
                                    <TableCell variant="head" padding="checkbox" align="left" sx={{fontWeight:"700", textAlign:"right", padding: "1rem"}}>
                                      <Typography variant="h6" data-test='invoice-total'>{props.invoice.value}</Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </Box>                      
                    </Box>
                </Grid>
              )}
                
            </Grid>            
        </Container>
      </Box>
    </Protected>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const token = context.req.cookies.authToken;
  let invoice = {};
  let error = '';
  try{
    const response: any = await getData(`invoices/${params.id}`, token, {});
    invoice = response.data.invoice;
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
      invoice : invoice,
      errorMessage: error
    }
  };
}

export default ViewInvoice;
