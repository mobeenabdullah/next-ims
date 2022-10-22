import { useState } from "react";
import { useCookies } from "react-cookie";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import styled from "styled-components";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from "@mui/icons-material/AccountCircle";
import styles from './header.module.scss';

const pages: any = [{label: 'Home', link: "/"}, {label: 'Clients', link: '/clients'}, {label: 'Invoices', link: '/invoices'}];
const settings: any = [{label: 'Logout', link: "/logout"}];

const Header = () => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [cookies, removeCookie] = useCookies(["authToken"]);
  const userName = useAppSelector((state: RootState) => state.user.name);

  const logOut = () => {
    if(cookies.authToken || !cookies.authToken) 
      removeCookie("authToken", {path:'/'});
      Router.push('/login')
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters> 
          <Box className={styles.header_logo_text}>            
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },              
                fontWeight: 700,              
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Link href="/">Invoice Management System</Link>                
            </Typography>
          </Box>         

          <Box sx={{flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Box className={styles.header_logo_text}>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,              
                fontWeight: 700,              
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              <Link href="/">Invoice Management System</Link>
            </Typography>
          </Box>
                              
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },                
              }}
              data-test='nav-bar'
            >
              {pages.map((page: any, index: number) => (                
                    <MenuItem key={index} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <Box className={styles.menu_item_link}>
                          <Link href={page.link} className={`${styles.menu_item} ${router.pathname === page.link ? 'active' : ''}`}>{page.label}</Link>                            
                        </Box>
                      </Typography>
                    </MenuItem>                 
              ))}
            </Menu>
            
          </Box>
      
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: '30px' }}>
            {pages.map((page: any, index: number) => (              
                <Button
                  key={index}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block', fontSize: '1.4rem' }}                  
                  component="div"
                  className={`menu_item_btn ${router.pathname === page.link ? 'active' : ''}`}
                >
                  <Box className={`${styles.menu_item_link} ${styles.menu_item_desktop}`}>
                    <Link href={page.link} className={`${styles.menu_item}`}>{page.label}</Link>  
                  </Box>
                </Button>
              
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title=''>
              <Box className={styles.dropdown_menu}>
                <IconButton 
                onClick={handleOpenUserMenu} sx={{ p: 0 }}
                color="inherit"
                className={styles.icon_box}
                >
                  <AccountCircle /> 
                  <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'block'}}}>
                  <Typography
                  variant="body1"
                  component="p"
                  sx={{ flexGrow: 1, }}
                  className="profile_name"
                >
                  {userName}
                </Typography>
                  </Box>                  
                </IconButton>
                <Box sx={{ display: { xs: 'block', sm: 'block', md: 'block', lg: 'none'}}}>
                  <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  >
                  <MenuIcon />              
                  </IconButton> 
                </Box>
              </Box>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              data-test='nav-bar'
            >
              {settings.map((setting: any , index: number) => (                
                  <MenuItem key={index} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={logOut} data-test='logout-button'>{setting.label}</Typography>
                  </MenuItem>                
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
