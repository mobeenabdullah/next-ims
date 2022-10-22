import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import Link from "next/link";
import Router, { useRouter } from "next/router";
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
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Box from "@mui/material/Box";
import { getData } from "../features/thunks/thunks";
import styles from './invoice-table.module.scss';

const InvoiceTable: FC = (props: any) => {
  const calculateOffSet = (query: any) => {
    let page = query.page || 1;
    let limit = query.limit || 10;
    return query.offset || ((page * limit) - limit);
  }

  const router : any = useRouter();
  const [cookies] = useCookies(["authToken"]);
  const [isLoading, SetIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState<any>(router.query.page || 1);
  const [sortBy, setSortBy] = useState<string>(router.query.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(router.query.sortOrder || 'asc');
  const [clientId, SetClientId] = useState<string>(router.query.clientId);
  const [offset, setOffset] = useState<any>(calculateOffSet(router.query));
  const [invoices, setInvoices] = useState([...props.invoiceList]);
  const [limit, setLimit] = useState<any>(router.query.limit || 10);
  const [errorMessage, setErrorMessage] = useState("No result found...");
  const [totalInvoices, setTotalInvoices] = useState(props.total);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
  }

  const handlePagination = (event: React.ChangeEvent<unknown>, currentPage: number) => {
    event.preventDefault();
    setPage(currentPage);
    setOffset((currentPage * limit) - limit);
    fetchInvoices(currentPage, sortBy,sortOrder, clientId, ((currentPage * limit) - limit),limit, '');
  }

  const companySort = () => {
    setSortBy('companyName');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchInvoices(page, 'companyName',sortOrder, clientId, offset, limit, '');
  }
  
  const priceSort = () => {
    setSortBy('price');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchInvoices(page, 'price',sortOrder, clientId, offset, limit, '');
  }
  const dateSort = () => {
    setSortBy('date');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchInvoices(page, 'date', sortOrder, clientId, offset,limit, '');
  }
  const dueDateSort = () => {
    setSortBy('dueDate');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchInvoices(page, 'dueDate',sortOrder, clientId, offset,limit, '');
  }


  const fetchInvoices = async (page, sortBy,sortOrder, clientId, offset,limit, projectCode) => {
    const filters = {
      page: page,
      sortBy: sortBy,
      sort: sortOrder,
      clientId: clientId,
      offset: offset,
      limit: limit,
      projectCode: ''
    }

    let urlParams : any = {};
    if(limit != 10) {
      urlParams.limit = limit;
    }
    if(clientId) {
      urlParams.clientId = clientId;
    }
    if(sortBy) {
      urlParams.sortBy = sortBy;
      urlParams.sortOrder = sortOrder;
    }
    if(page > 1) {
      urlParams.page = page
    }

    const queryParams : any = (new URLSearchParams(urlParams)).toString();

    Router.push('/invoices',  `/invoices/?${queryParams}`, {shallow: true})

    SetIsLoading(true);
    try {
      const invoicesList = await getData('invoices', cookies.authToken, filters);
      setTotalInvoices(invoicesList.data.total);
      setInvoices(invoicesList.data.invoices);
      SetIsLoading(false);
    } catch (error: any) {
      SetIsLoading(false);
      setIsError(true);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage(error.message);
      }
      if (error.status === 500) {
        setErrorMessage("No internet connectivity");
      } else {
        setErrorMessage(error.response.data);
      }
    }
  };

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
          sx={{flexWrap: {xs: 'nowrap', sm: 'nowrap', md: 'nowrap'}}}   
        >
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h6">Latest Invoice</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            display="flex"
            justifyContent="end"
            gap="10px"
          >
          
            <Box className={styles.button_style}>
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
          </Grid>
        </Grid>

        {isError && (
          <Alert severity="error">
            <Typography variant="body1" component="p"  date-test="invoices-fetch-error">{errorMessage}</Typography>
          </Alert>
        )}
        {isLoading && (
          <Card
            sx={{              
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box className={styles.loading_wrapper} data-test="loading-overlay">
              <CircularProgress color="primary" size="60px" />
            </Box>
            <p>Loading invoices...</p>
          </Card>
        )}
        {!isLoading && (
          <Card>
            <CardContent>
              <TableContainer>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
                  data-test="clients-table"
                >
                  <TableHead>
                  <TableRow>
                      <TableCell align="left">
                        <Box className={styles.sort_style}>
                          <Box display="flex" alignItems="center" className="table_heading" justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                            <Typography component="span" sx={{ fontWeight: '700'}}>Invoice</Typography>                            
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Box className={styles.sort_style}>
                          <Box display="flex" alignItems="center" className="table_heading" justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                            <Typography component="span" sx={{ fontWeight: '700'}}>Client</Typography>                            
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left" data-test='company-name-header' onClick={companySort}>
                        <Box className={styles.sort_style}>
                          <Box display="flex" alignItems="center" className="table_heading" justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                            <Typography component="span" sx={{ fontWeight: '700'}}>Company</Typography>
                            <ImportExportIcon className="sort_icon" />
                          </Box>
                        </Box>                         
                      </TableCell>
                      <TableCell align="left" data-test='total-header' onClick={priceSort}>
                        <Box className={styles.sort_style}>
                          <Box display="flex" alignItems="center" className="table_heading" justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                            <Typography component="span" sx={{ fontWeight: '700'}}>Value</Typography>
                            <ImportExportIcon className="sort_icon" />
                          </Box>
                        </Box>                         
                      </TableCell>
                      <TableCell align="left" data-test='creation-date-header' onClick={dateSort}>
                        <Box className={styles.sort_style}>
                          <Box display="flex" alignItems="center" className="table_heading" justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                            <Typography component="span" sx={{ fontWeight: '700'}}>Date</Typography>
                            <ImportExportIcon className="sort_icon" />
                          </Box>
                        </Box>                         
                      </TableCell>
                      <TableCell align="left" data-test='due-date-header' onClick={dueDateSort}>
                        <Box className={styles.sort_style}>
                          <Box display="flex" alignItems="center" className="table_heading" justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                            <Typography component="span" sx={{ fontWeight: '700'}}>Due Date</Typography>
                            <ImportExportIcon className="sort_icon" />
                          </Box>
                        </Box>                        
                      </TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.length === 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ border: "none"}}>                          
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
                        <TableCell align="left" data-test='invoice-client-name' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.client.name}</TableCell>
                        <TableCell align="left" data-test='invoice-client-company-name' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.client.companyDetails.name}</TableCell>
                        <TableCell align="left" data-test='invoice-value' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{invoiceItem.invoice.value}</TableCell>
                        <TableCell align="left" data-test='invoice-date' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{formatDate(invoiceItem.invoice.date)}</TableCell>
                        <TableCell align="left" data-test='invoice-due-date' onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view`)}>{formatDate(invoiceItem.invoice.dueDate)}</TableCell>                      
                        <TableCell align="right">
                          <IconButton
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            data-test='invoice-actions'
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
                            <MenuItem onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/view/?print=true`)} >
                              <ListItemIcon>
                                <BorderColorOutlinedIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Print invoice</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => Router.push(`/invoices/${invoiceItem.invoice.id}/edit`)} >
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

        {totalInvoices/limit > 1 && (
          <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" mt={6}>
            <Pagination
              count={Math.ceil(totalInvoices/limit)}
              color="primary"
              shape="rounded"
              onChange={handlePagination}
              renderItem={(item) => (
                <PaginationItem
                  data-test={`page-${item.page}`}
                  components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        )}
       
      </Box>
    </>
  );
};

export default InvoiceTable;