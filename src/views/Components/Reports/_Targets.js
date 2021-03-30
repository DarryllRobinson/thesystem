import React from 'react';
import FetchData from 'utils/FetchData';

import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';

import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import styles from 'assets/jss/material-kit-react/views/landingPage.js';

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

function createData(goal, target, current, percentage) {
  return { goal, target, current, percentage };
}

const rows = [
  createData('30 Days', 1000, 11000, 100),
  createData('60 Days', 3000, 7000, 66),
];

export default function Targets(props) {
  const classes = useStyles();
  const fetchData = new FetchData();
  const reportObject = {
    workspace: 'collections',
    reportName: 'aging',
    clientId: 1,
  };
  //const response = fetchData.useFetch;
  console.log('fetchData: ', fetchData);

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={8} md={6}>
          <Card>
            <CardBody>
              <TableContainer component={Paper}>
                <FetchData />
                <Table
                  className={classes.table}
                  aria-label="target reports table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Goal</StyledTableCell>
                      <StyledTableCell align="right">Target</StyledTableCell>
                      <StyledTableCell align="right">Current</StyledTableCell>
                      <StyledTableCell align="right">
                        Percentage
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.goal}>
                        <StyledTableCell component="th" scope="row">
                          {row.goal}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.target}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.current}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.percentage}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter>Aging Report</CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={8} md={6}>
          <Card>
            <CardBody>
              <TableContainer component={Paper}>
                <Table
                  className={classes.table}
                  aria-label="target reports table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Goal</StyledTableCell>
                      <StyledTableCell align="right">Target</StyledTableCell>
                      <StyledTableCell align="right">Current</StyledTableCell>
                      <StyledTableCell align="right">
                        Percentage
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.goal}>
                        <StyledTableCell component="th" scope="row">
                          {row.goal}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.target}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.current}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.percentage}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter>Aging Report</CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
