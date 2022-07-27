import { FC, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import GoogleIcon from "@mui/icons-material/Google";
import ErrorIcon from "@mui/icons-material/Error";

export const LoginStatus: FC = (props) => {
  const router = useRouter();
  const baseLoginOptions = {
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URI!}/callback?returnTo=${
      router.pathname
    }`,
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
        startIcon={<PersonIcon />}
        id="loggedin-button"
        aria-controls={open ? "loggedin-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Logged in: {user?.email}
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
        <MenuItem
          onClick={() =>
            logout({ returnTo: `${process.env.NEXT_PUBLIC_BASE_URI!}/` })
          }
        >
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
          <ListItemText>default connection</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
              connection: "a0sandbox-default",
            })
          }
        >
          <ListItemIcon>
            <PasswordIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>a0sandbox-default</ListItemText>
        </MenuItem>
        <MenuItem
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
        </MenuItem>
        <MenuItem
          onClick={() =>
            loginWithRedirect({
              ...baseLoginOptions,
              connection: "invalid",
            })
          }
        >
          <ListItemIcon>
            <ErrorIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>invalid</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};