/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import { authenticationService } from 'services';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MapIcon from '@material-ui/icons/Map';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';

// core components
//import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

const milestones = [
  {
    title: 'Milestone 1',
    version: '0.0.1',
    description: 'Just getting started...',
    complete: true,
  },
  {
    title: 'Milestone 2',
    version: '1.0.0',
    description: (
      <div>
        <h2>Launch!</h2>
        <p>Woohoo!</p>
      </div>
    ),
    complete: true,
  },
];

export default function HeaderLinks(props) {
  const classes = useStyles();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="roadmap-tooltip"
          title="Exciting new features on their way!"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="roadmap"
            color="transparent"
            className={classes.navLink}
          >
            <MapIcon className={classes.icons} /> Product Roadmap
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="pricing-tooltip"
          title="See how we can save you money"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="pricing"
            color="transparent"
            className={classes.navLink}
          >
            <LocalAtmIcon className={classes.icons} /> Pricing
          </Button>
        </Tooltip>
      </ListItem>
      {listToDisplay()}
      {/*
        <ListItem className={classes.listItem}>
          <CustomDropdown
            noLiPadding
            buttonText="Components"
            buttonProps={{
              className: classes.navLink,
              color: "transparent"
            }}
            buttonIcon={Apps}
            dropdownList={[
              <Link to="/" className={classes.dropdownLink}>
                All components
              </Link>,
              <a
                href="https://creativetimofficial.github.io/material-kit-react/#/documentation?ref=mkr-navbar"
                target="_blank"
                className={classes.dropdownLink}
              >
                Documentation
              </a>
            ]}
          />
        </ListItem>
        */}
    </List>
  )
}

function listToDisplay() {
  const currentUser = authenticationService.currentUserValue;
  const classes = useStyles();

  // return list depending on logged in status
  if (!currentUser) {
    return (
      <ListItem className={classes.listItem}>
        <Tooltip
          id="login-tooltip"
          title="Login to access the agent workspace"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href='/login'
            color="transparent"
            className={classes.navLink}
          >
             <PersonIcon className={classes.icons} /> Login
          </Button>
        </Tooltip>
      </ListItem>
    )
  } else {
    return (
      <ListItem className={classes.listItem}>
        <Tooltip
          id="workspace-tooltip"
          title="Return to the agent workspace"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href='/dashboard'
            color="transparent"
            className={classes.navLink}
          >
             <DashboardIcon className={classes.icons} /> Workspace
          </Button>
        </Tooltip>
      </ListItem>
    )
  }
}
