import { FC, useEffect, useState} from 'react';
import { useCookies } from "react-cookie";
import Link from "next/link";
import Router from 'next/router';
import { Button, Typography, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import styles from './dashboard-invoice.module.scss';
import Box from '@mui/material/Box';


const DashboardInvoices: FC = ({invoiceList}) => {
  const [invoices, setInvoices] = useState([...invoiceList]);
  const [isLoading, SetIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No result found...");

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box className={styles.wrapper}>
        <Grid
          container
          rowSpacing={1}
          alignItems="center"
          m={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3, p: 2 }}
        >
          <Grid item xs={12} sm={12} md={6}  sx={{ textAlign: {xs: 'center', sm: 'center', md: 'left', lg: 'left'}}}>
            <Typography variant="h6">Latest Invoices</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            display="flex"
            justifyContent="end"
            gap="10px"
            sx={{ justifyContent: {xs: 'center', sm: 'center', md: 'right', lg: 'right'}}}
          >           
            <Box className={styles.button_styles}>
              <Link
                  href="/create-invoice"
                  data-test="add-client"
                >
                <Button
                  variant="contained"              
                  data-test="add-client"
                  component="span"
                >              
                  Create Invoice
                </Button>
              </Link>
            </Box>
            <Box className={styles.button_styles}>
              <Link
                  href="/invoices"
                  data-test="add-client"
                >
              <Button
                variant="contained"              
                data-test="view-all-clients"
                component="span"
              >
                ALl Invoices
              </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
        {isError && (
          <Alert severity="error">
            <Typography variant="body1" component="p"  date-test="clients-fetch-error">{errorMessage}</Typography>
          </Alert>
        )}
        {isLoading && (
          <Card
            sx={{
              minWidth: 275,  
              minHeight: "150px",            
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box className={styles.login_wrapper} data-test="loading-overlay">
              <CircularProgress color="primary" size="60px" />
            </Box>
            <p>Loading Invoices...</p>
          </Card>
        )}

        {!isLoading && (
          <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Invoice number</Typography></TableCell>
                    <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Client</Typography></TableCell>
                    <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Date</Typography></TableCell>
                    <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Project</Typography></TableCell>
                    <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Amount</Typography></TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell component="th" scope="row"  sx={{ border: "none" }}>                          
                        <Typography variant="body1" component="p" data-test="empty-placeholder">No result found...</Typography>                            
                      </TableCell>                        
                    </TableRow>
                      
                    )}
                  {invoices.length > 0 && invoices.map((invoiceItem: any) => (
                    <TableRow
                      key={invoiceItem.invoice.id}
                      data-test={`invoice-row-${invoiceItem.invoice.id}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                    >
                      
                      <TableCell component="th" scope="row" data-test='invoice-number' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.invoice.invoice_number}</TableCell>
                      <TableCell align="left" data-test='invoice-company' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.client.name}</TableCell>
                      <TableCell align="left" data-test='invoice-date' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{formatDate(invoiceItem.invoice.date)}</TableCell>
                      <TableCell align="left" data-test='invoice-project' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.invoice.projectCode}</TableCell>
                      <TableCell align="left" data-test='invoice-price' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.invoice.value}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          elevation={1}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {" "}
                          <MenuItem onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view/?print=true`)} data-test='invoice-actions'>
                            <ListItemIcon>
                              <BorderColorOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Print invoice</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/edit`)} data-test='invoice-actions'>
                            <ListItemIcon>
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Edit invoice</ListItemText>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        )}
        
      </Box>
    </>
  );
};

export default DashboardInvoices;
