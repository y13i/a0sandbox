import { FC } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

import { Link } from "./Link";
import { usePageAttributes } from "../hooks/usePageAttributes";

export const Menu: FC<{ disableTooltip: boolean }> = (props) => (
  <List>
    {usePageAttributes().map((pageAttribute, i) => (
      <Link
        key={i}
        href={pageAttribute.path}
        passHref
        color="primary"
        underline="none"
      >
        <ListItem button>
          <Tooltip
            title={pageAttribute.title}
            componentsProps={{
              tooltip: {
                sx: { ...(props.disableTooltip && { display: "none" }) },
              },
            }}
          >
            <ListItemIcon>{pageAttribute.icon}</ListItemIcon>
          </Tooltip>
          <ListItemText primary={pageAttribute.title} />
        </ListItem>
      </Link>
    ))}
  </List>
);
