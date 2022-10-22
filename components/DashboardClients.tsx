import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Link from "next/link";
import Router from "next/router";
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
import Box from '@mui/material/Box';
import styles from './dashboard-clients.module.scss';

const DashboardClients: FC = ({clientsList}) => {
  const [cookies] = useCookies(["authToken"]);
  const [clientRows, setClientRows] = useState([...clientsList]);
  const [isLoading, SetIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No client found...");

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
          <Grid item xs={12} sm={12} md={6} sx={{ textAlign: {xs: 'center', sm: 'center', md: 'left', lg: 'left'}}}>
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
            sx={{ justifyContent: {xs: 'center', sm: 'center', md: 'right', lg: 'right'}}}
          >
            <Box className={styles.button_styles}>
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
            <Box className={styles.button_styles}>
              <Link
                  href="/clients"
                  data-test="add-client"
                >
              <Button
                variant="contained"              
                data-test="view-all-clients"
                component="span"
              >
                ALl Clients
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
            <Box className={styles.loading_wrapper} data-test="loading-overlay">
              <CircularProgress color="primary" size="60px" />
            </Box>
            <p>Loading clients...</p>
          </Card>
        )}
        {!isLoading && (
          <Card
            sx={{
              minWidth: 275,              
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <TableContainer>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
                  data-test="clients-table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography component="span" sx={{ fontWeight: '700'}}>Name</Typography></TableCell>
                      <TableCell align="left">
                        <Typography component="span" sx={{ fontWeight: '700'}}>Company name</Typography></TableCell>
                      <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Total billed</Typography></TableCell>
                      <TableCell align="left"><Typography component="span" sx={{ fontWeight: '700'}}>Invoices</Typography></TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientRows.length === 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row"  sx={{ border: "none" }}>                          
                          <Typography variant="body1" component="p"  data-test="empty-placeholder">No client found...</Typography>
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
                              data-test="client-actions"
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
                              <MenuItem
                                onClick={() => Router.push(`/create-invoice/client/${row.id}`)}
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
      </Box>
    </>
  );
};

export default DashboardClients;
