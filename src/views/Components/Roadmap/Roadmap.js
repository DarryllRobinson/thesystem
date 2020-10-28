import React from 'react';
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import { withStyles, makeStyles } from '@material-ui/core/styles';

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import styles from "assets/jss/material-kit-react/views/landingPage.js";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles(styles);

const useThemes = makeStyles((themes) => ({
  CardFooter: {
    color: "#7b8a8b",
    fontSize: "10px"
  }
}));

function createData(ability, description, dropdate) {
  return { ability, description, dropdate };
}

const rows = [
  createData('User manual', 'A simple video manual on how to use The System', 'Q4 2020'),
  createData('Client dashboard', 'A snapshot of the current collections situation from the client point of view', 'Q4 2020'),
  createData('Email notifications', 'Email notifications for daily work per user', 'Q4 2020'),
  createData('Payments', 'The ability to accept credit card payments', 'Q1 2021'),
  createData('Applications', 'Expanding the platform to enable application processing', 'Q1 2021'),
  createData('Salesforce integration', 'Integration to Salesforce CRM', 'Q1 2021'),
  createData('Xero integration', 'Integration to Xero accounting system', 'Q2 2021'),
];

export default function Roadmap(props) {
  const classes = useStyles();
  const themes = useThemes();
  const { ...rest } = props;

  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="The System"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <Parallax filter image={require("assets/img/bg2.jpg")}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>"If you look for perfection, you'll never be content" - Leo Tolstoy</h1>
              <h5 className={classes.description}>
                Whilst we don{"'"}t believe we{"'"}ll ever achieve perfection, we may as well aim for it!
              </h5>
              <br />
            </GridItem>

          </GridContainer>
        </div>
      </Parallax>
      <div className={classes.container}>
        <Card>
          <CardBody>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="product roadmap table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>New functionality</StyledTableCell>
                    <StyledTableCell align="left">Description</StyledTableCell>
                    <StyledTableCell align="left">Drop Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.ability}>
                      <StyledTableCell component="th" scope="row">
                        {row.ability}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.description}</StyledTableCell>
                      <StyledTableCell align="left">{row.dropdate}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardBody>
          <CardFooter className={themes.CardFooter}>Drop dates are estimates only and as such, are subject to change without notice</CardFooter>
        </Card>
      </div>
      <Footer greyFont/>
    </div>
  );
}
