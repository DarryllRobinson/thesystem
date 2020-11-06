import React from 'react';

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

const data = [
  {
    goal: '30 Days',
    target: 1000,
    current: 11000
  },
  {
    goal: '60 Days',
    target: 3000,
    current: 7000
  },
  {
    goal: '90 Days',
    target: 3000,
    current: 5000
  },
  {
    goal: '120 Days',
    target: 5000,
    current: 3000
  },
  {
    goal: '150 Days',
    target: 11000,
    current: 1000
  }
];

const extract = [
  {
    reportName: 'Aging',
    data: [
      {
        goal: '30 Days',
        target: 1000,
        current: 11000
      },
      {
        goal: '60 Days',
        target: 3000,
        current: 7000
      },
      {
        goal: '90 Days',
        target: 3000,
        current: 5000
      },
      {
        goal: '120 Days',
        target: 5000,
        current: 3000
      },
      {
        goal: '150 Days',
        target: 11000,
        current: 1000
      }
    ]
  },
  {
    reportName: 'Other',
    data: [
      {
        goal: 'goal 1',
        target: 1000,
        current: 11000
      },
      {
        goal: '60 Days',
        target: 3000,
        current: 7000
      },
      {
        goal: '90 Days',
        target: 3000,
        current: 5000
      },
      {
        goal: '120 Days',
        target: 5000,
        current: 3000
      },
      {
        goal: '150 Days',
        target: 11000,
        current: 1000
      }
    ]
  }
];

function createData(goal, target, current, percentage) {
  return { goal, target, current, percentage };
}

const rows = extract.map(report =>
  report.data.map((row, idx) =>
    //console.log('row: ', row)
    createData(row.goal, row.target, row.current, `${Math.floor(row.current/row.target*100)}%`)
  )
);

export default function Targets(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>{console.log({rows})}
      <GridContainer justify="center">
        <GridItem xs={12} sm={8} md={6}>
          <Card>
            <CardBody>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="targets table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Goal</StyledTableCell>
                      <StyledTableCell align="right">Target</StyledTableCell>
                      <StyledTableCell align="right">Current</StyledTableCell>
                      <StyledTableCell align="right">Percentage</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <StyledTableRow key={row[idx].goal}>
                        <StyledTableCell component="th" scope="row">
                          {row[idx].goal}
                        </StyledTableCell>
                        <StyledTableCell align="right">R {row[idx].target}</StyledTableCell>
                        <StyledTableCell align="right">R {row[idx].current}</StyledTableCell>
                        <StyledTableCell align="right">{row[idx].percentage}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter>Aging Report</CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardBody>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="targets table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Goal</StyledTableCell>
                      <StyledTableCell align="right">Target</StyledTableCell>
                      <StyledTableCell align="right">Current</StyledTableCell>
                      <StyledTableCell align="right">Percentage</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <StyledTableRow key={row[idx].goal}>
                        <StyledTableCell component="th" scope="row">
                          {row[idx].goal}
                        </StyledTableCell>
                        <StyledTableCell align="right">R {row[idx].target}</StyledTableCell>
                        <StyledTableCell align="right">R {row[idx].current}</StyledTableCell>
                        <StyledTableCell align="right">{row[idx].percentage}</StyledTableCell>
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
  )
}
