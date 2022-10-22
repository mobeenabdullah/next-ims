import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Button, Typography, Divider, Grid } from "@mui/material";
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
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Box from "@mui/material/Box";
import Protected from "../../components/protectedRoutes";
import Header from "../../components/Header";
import { Container } from "@mui/system";
import { graphqlGetClients } from "../../features/thunks/thunks";
import styles from './clients.module.scss';

const Clients: FC = (props : any) => {
  const calculateOffSet = (query: any) => {
    let page = query.page || 1;
    let limit = query.limit || 10;
    return query.offset || ((page * limit) - limit);
  }
  const router : any = useRouter();
  const [cookies] = useCookies(["authToken"]);
  const [clientRows, setClientRows] = useState(props.clients);
  const [isLoading, SetIsLoading] = useState(false);
  const [isError, setIsError] = useState(props.errorMessage !== '' ? true : false);
  const [errorMessage, setErrorMessage] = useState(props.errorMessage);
  const [totalClients, setTotalClients] = useState(props.total);
  const [page, setPage] = useState<any>(router.query.page || 1);
  const [offset, setOffset] = useState<any>(calculateOffSet(router.query));
  const [limit, setLimit] = useState<any>(router.query.limit || 10);
  const [sortBy, setSortBy] = useState<string>(router.query.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(router.query.sortOrder || 'asc');

  const handlePagination = (event: React.ChangeEvent<unknown>, currentPage: number) => {
    event.preventDefault();
    setPage(currentPage);
    setOffset((currentPage * limit) - limit);
    fetchClientsList(currentPage, sortBy, sortOrder, limit, (currentPage * limit) - limit);
  }
  
  const companyNameSort = () => {
    setSortBy('companyName');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchClientsList(page, 'companyName', sortOrder, limit, offset);
  }

  const clientNameSort = () => {
    setSortBy('clientName');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchClientsList(page, 'clientName', sortOrder, limit, offset);
  }

  const invoicesCountSort = () => {
    setSortBy('invoicesCount');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchClientsList(page, 'invoicesCount', sortOrder, limit, offset);
  }

  const totalBilledSort = () => {
    setSortBy('totalBilled');
    if(!sortOrder || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc');
    }
    fetchClientsList(page, 'totalBilled', sortOrder, limit, offset);
  }

  const fetchClientsList = async (page, sortBy, sortOrder, limit, offset) => {

    let urlParams : any = {};
    if(limit != 10) {
      urlParams.limit = limit;
    }
    
    if(sortBy !== 'creation') {
      urlParams.sortBy = sortBy;
      urlParams.sortOrder = sortOrder;
    }
    if(page > 1) {
      urlParams.page = page
    }

    const queryParams : any = (new URLSearchParams(urlParams)).toString();
    Router.push('/clients',  `/clients/?${queryParams}`, {shallow: true})

    SetIsLoading(true);
    try {
      const filters = {
        sortBy: sortBy || 'creation',
        sortOrder:sortOrder,
        offset: offset,
        limit: limit
      }

      const clientsList = await  graphqlGetClients(cookies.authToken, 'graphql', filters);
      setClientRows(clientsList.clients.results);
      setTotalClients(clientsList.clients.total)
      SetIsLoading(false);
      setIsError(false);
      setErrorMessage('');
    } catch (error: any) {
      console.error(error)
      SetIsLoading(false);
      setIsError(true);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage(error.message);
      } else if (JSON.parse(JSON.stringify(error)).response.status === 500) {
        setErrorMessage("No internet connectivity");
      } else {
        if(JSON.parse(JSON.stringify(error)).response.errors){
          setErrorMessage(JSON.parse(JSON.stringify(error)).response.errors[0].message);
        } else {
          setErrorMessage(JSON.parse(JSON.stringify(error)).response.error);
        }
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
                  <Typography variant="h6">Latest Clients</Typography>
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
                        href="/create-client"
                        data-test="add-client"
                      >
                      <Button
                        variant="contained"              
                        data-test="add-client"
                        component="span"
                      >              
                        Create Client
                      </Button>
                    </Link>
                  </Box>

                </Grid>
              </Grid>

              {isError && (
                <Alert severity="error">
                  <Typography variant="body1" component="p" date-test="clients-fetch-error">{errorMessage}</Typography>
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
                  <p>Loading clients...</p>
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
                            <TableCell data-test='client-name-header' onClick={clientNameSort}>
                              <Box className={styles.sort_style}>
                                <Box display="flex" alignItems="center" className={styles.table_heading} justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                                  <Typography component="span" sx={{ fontWeight: '700'}}>Name</Typography>
                                  <ImportExportIcon className={styles.sort_icon} />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell data-test='company-name-header' align="left" onClick={companyNameSort}>
                              <Box className={styles.sort_style}>
                                <Box display="flex" alignItems="center" className={styles.table_heading} justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                                  <Typography component="span" sx={{ fontWeight: '700'}}>Company name</Typography>
                                  <ImportExportIcon className={styles.sort_icon} />
                                </Box>
                              </Box>                        
                              </TableCell>
                            <TableCell align="left">
                              <Box className={styles.sort_style}>
                                <Box display="flex" alignItems="center" className={styles.table_heading} justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                                  <Typography component="span" sx={{ fontWeight: '700'}}>Email</Typography>                            
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left" data-test='total-billed-header' onClick={totalBilledSort}>
                              <Box className={styles.sort_style}>
                                <Box display="flex" alignItems="center" className={styles.table_heading} justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                                  <Typography component="span" sx={{ fontWeight: '700'}}>Total billed</Typography>
                                  <ImportExportIcon className={styles.sort_icon} />
                                </Box>
                              </Box>                        
                            </TableCell>
                            <TableCell align="left" data-test='invoices-count-header' onClick={invoicesCountSort}>
                              <Box className={styles.sort_style}>
                                <Box display="flex" alignItems="center" className={styles.table_heading} justifyContent="space-between" sx={{ cursor: 'pointer'}}>
                                  <Typography component="span" sx={{ fontWeight: '700'}}>Invoices</Typography>
                                  <ImportExportIcon className={styles.sort_icon} />
                                </Box>
                              </Box>                        
                            </TableCell>
                            <TableCell align="left"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clientRows.length === 0 && (
                            <TableRow>
                              <TableCell component="th" scope="row"  sx={{ border: "none" }}>                          
                                <Typography variant="body1" component="p"  data-test="empty-placeholder">No result found...</Typography>
                              </TableCell>                        
                            </TableRow>                      
                          )}
                          {clientRows.length > 0 &&
                            clientRows.map((row: any) => (
                              <TableRow
                                key={row.id}
                                data-test={`client-row-${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": { border: 0 },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  data-test="client-name"
                                  onClick={() => Router.push(`/clients/${row.id}`)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {row.name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  data-test="client-companyName"
                                  onClick={() => Router.push(`/clients/${row.id}`)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {row.companyDetails.name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  data-test="client-email"
                                  onClick={() => Router.push(`/clients/${row.id}`)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {row.email}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  data-test="client-totalBilled"
                                  onClick={() => Router.push(`/clients/${row.id}`)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {row.totalBilled}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  data-test="client-invoicesCount"
                                  onClick={() => Router.push(`/clients/${row.id}`)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {row.invoicesCount}
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    id="basic-button"
                                    aria-controls={open ? "basic-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                    data-test="client-actions"
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
                                    <MenuItem
                                      onClick={() => Router.push("create-invoice")}
                                    >
                                      <ListItemIcon>
                                        <BorderColorOutlinedIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText>Add new invoice</ListItemText>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                      onClick={() => Router.push(`clients/${row.id}`)}
                                    >
                                      <ListItemIcon>
                                        <RemoveRedEyeOutlinedIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText>Edit client</ListItemText>
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
              {totalClients/limit > 1 && (
                <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" mt={6}>
                  <Pagination
                    count={Math.ceil(totalClients/limit)}
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
  let errorMessage = '';
  let clientsList = [];
  let total = 0;

  try {
    const filters = {
      sortBy: query.sortBy || 'creation',
      sortOrder: query.sortOrder || 'desc',
      offset: query.offset || (page * limit) - limit,
      limit: limit
    }
    const response = await  graphqlGetClients(token,'graphql', filters);
    clientsList = response.clients.results;
    total = response.clients.total;
    
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") {
      errorMessage = error.message;
    } else if (JSON.parse(JSON.stringify(error)).response.status === 500) {
      errorMessage ="No internet connectivity";
    } else {
      if(JSON.parse(JSON.stringify(error)).response.errors){
        errorMessage = JSON.parse(JSON.stringify(error)).response.errors[0].message;
      } else {
        errorMessage = JSON.parse(JSON.stringify(error)).response.error
      }
    }
  }

  return {
    props: {
      clients: clientsList,
      total: total,
      errorMessage: errorMessage
    }
  };

}

export default Clients;
