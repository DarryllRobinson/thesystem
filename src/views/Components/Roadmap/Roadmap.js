import React from 'react';
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons
import DvrIcon from '@material-ui/icons/Dvr';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';

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
import Button from "components/CustomButtons/Button.js";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import styles from "assets/jss/material-kit-react/views/landingPage.js";

const useStyles = makeStyles(styles);

function createData(ability, description, dropdate, impact) {
  return { ability, description, dropdate, impact };
}

const rows = [
  createData('Frozen yoghurt', 'fy', 'Nov', 24),
  createData('Ice cream sandwich', 'ics', 'Dec', 13),
  createData('Eclair', 'ec', 'Jan', 24),
  createData('Cupcake', 'cc', 'Feb', 67),
  createData('Gingerbread', 'gb', 'Mar', 49),
];

export default function Roadmap(props) {
  const classes = useStyles();
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
              <h1 className={classes.title}>What is coming next?</h1>
              <h5 className={classes.description}>
                Cool stuffs
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
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>New functionality</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="right">Drop Date</TableCell>
                    <TableCell align="right">Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.ability}>
                      <TableCell component="th" scope="row">
                        {row.ability}
                      </TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="right">{row.dropdate}</TableCell>
                      <TableCell align="right">{row.impact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </div>
      <Footer greyFont/>
    </div>
  );
}
