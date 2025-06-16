import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { UserContext } from '../contexts/UserContext';
import "../style/Nav.scss";
import LogoutPopup from './LogoutPopup';

const Nav = () => {
  const { user } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isLoggedIn = !!user;
  const isRecruiter = user?.role === "recruiter";
  const [showPopup, setShowPopup] = useState(false);
 const handlePopupShow = () => {
  setShowPopup(true);
  console.log("Popup shown");
};

  const handlePopupClose = () => {
    setShowPopup(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = (
    <>
      {!isLoggedIn && (
        <>
          <Button
            color="inherit"
            component={Link}
            to="/register"
            className="nav-button"
          >
            Register
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            className="nav-button"
          >
            Login
          </Button>
        </>
      )}

      {isRecruiter && (
        <Button
          color="inherit"
          component={Link}
          to="/company-dashboard"
          className="nav-button"
        >
          Company Dashboard
        </Button>
      )}

      {isLoggedIn && (
        <>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            className="nav-button"
          >
            User Dashboard
          </Button>
          <button

          onClick={handlePopupShow}
          onClose={handlePopupClose}
          className="logout-button"


          >
            Logout
          </button>
        </>
      )}
    </>
  );

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {!isLoggedIn && (
          <>
            <ListItem button component={Link} to="/register" onClick={handleDrawerToggle}>
              <ListItemText primary="Register" />
            </ListItem>
            <ListItem button component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Login" />
            </ListItem>
          </>
        )}

        {isRecruiter && (
          <ListItem button component={Link} to="/company-dashboard" onClick={handleDrawerToggle}>
            <ListItemText primary="Company Dashboard" />
          </ListItem>
        )}

        {isLoggedIn && (
          <>
            <ListItem button component={Link} to="/dashboard" onClick={handleDrawerToggle}>
              <ListItemText primary="User Dashboard" />
            </ListItem>
            <ListItem>

              <button
          onClick={handlePopupShow}
          className="logout-button dark"
          >
            Logout
          </button>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" className="mui-appbar">
        <Toolbar className="mui-toolbar">
          <Typography
            variant="h4"
            component={Link}
            to="/"
            className="logo"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Hirible
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className="nav-links">
              {navigationItems}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      <LogoutPopup isOpen={showPopup} onClose={handlePopupClose} />
    </>
  );
};

export default Nav;
