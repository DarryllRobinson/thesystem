import React from 'react';
import FetchData from 'utils/FetchData';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { withStyles, makeStyles } from '@material-ui/core/styles';
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

const reportList = [
  {
    name: 'Aging',
    goals: [
      '30 Days',
      '60 Days'
    ],
    current: [
      1000,
      3000
    ],
    target: [
      3000,
      5000
    ]
  },
  {
    name: 'Agent Performance',
    goals: [
      '30 Days',
      '60 Days'
    ],
    current: [
      7000,
      11000
    ],
    target: [
      13000,
      17000
    ]
  },
  {
    name: 'Another Report',
    goals: [
      '30 Days',
      '60 Days'
    ],
    current: [
      7000,
      11000
    ],
    target: [
      13000,
      17000
    ]
  }
];

function buildReport(report, classes, idx) {
  return (
    <GridItem key={idx} xs={12} sm={8} md={6}>
      <Card>
        <CardBody>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="target reports table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Goal</StyledTableCell>
                  <StyledTableCell align="right">Current</StyledTableCell>
                  <StyledTableCell align="right">Target</StyledTableCell>
                  <StyledTableCell align="right">Percentage</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buildTable(report)}
              </TableBody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter>{report.name}</CardFooter>
      </Card>
    </GridItem>
  )
}

function buildTable(report) {
  //console.log('report: ', report);
  let rows = [];
  for (let loop = 0; loop < report.goals.length; loop++) {
    rows.push(createData(
      report.goals[loop],
      report.target[loop],
      report.current[loop],
      Math.floor(report.current[loop]/report.target[loop]*100)));
  }
  return (
    rows.map((row) => (
      <StyledTableRow key={row.goal}>
        <StyledTableCell component="th" scope="row">
          {row.goal}
        </StyledTableCell>
        <StyledTableCell align="right">R {row.current}</StyledTableCell>
        <StyledTableCell align="right">R {row.target}</StyledTableCell>
        <StyledTableCell align="right">{row.percentage}%</StyledTableCell>
      </StyledTableRow>
    ))
  )
}

function createData(goal, target, current, percentage) {
  return { goal, target, current, percentage };
}

export default function Targets(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
      {reportList.map((report, idx) => (
        buildReport(report, classes, idx)
      ))}
      </GridContainer>
    </div>
  )
}
