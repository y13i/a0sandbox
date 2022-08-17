import { FC, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PasswordIcon from "@mui/icons-material/Password";
import BusinessIcon from "@mui/icons-material/Business";
import GoogleIcon from "@mui/icons-material/Google";

import { baseUri } from "../src/utils";

export const LoginStatus: FC = (props) => {
  const router = useRouter();
  const baseLoginOptions = {
    redirectUri: `${baseUri}/auth/callback?returnTo=${router.pathname}`,
  };
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } =
    useAuth0();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(undefined);
  };

  return isLoading ? (
    <CircularProgress />
  ) : isAuthenticated ? (
    <>
      <Button
        color="inherit"
        startIcon={
          <Avatar
            alt={user?.email}
            src={user?.picture}
            sx={{ width: 30, height: 30 }}
          />
        }
        id="loggedin-button"
        aria-controls={open ? "loggedin-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Logged in
      </Button>
      <Menu
        id="loggedin-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "loggedin-button",
        }}
      >
        <MenuItem onClick={() => logout({ returnTo: `${baseUri}/` })}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <>
      <Button
        color="inherit"
        startIcon={<LoginIcon />}
        id="login-button"
        aria-controls={open ? "login-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Login
      </Button>
      <Menu
        id="login-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "login-button",
        }}
      >
        <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
            })
          }
        >
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>(specify no connection)</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
              connection: "db",
            })
          }
        >
          <ListItemIcon>
            <PasswordIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>db</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
              connection: "oidc",
            })
          }
        >
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>oidc</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
              connection: "saml",
            })
          }
        >
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>saml</ListItemText>
        </MenuItem>
        {/* <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
              connection: "google-oauth2",
            })
          }
        >
          <ListItemIcon>
            <GoogleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>google-oauth2</ListItemText>
        </MenuItem> */}
      </Menu>
    </>
  );
};
