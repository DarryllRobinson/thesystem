import React from 'react';

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
    current: 500
  },
  {
    goal: '60 Days',
    target: 3000,
    current: 5000
  }
];

function createData(goal, target, current, percentage) {
  return { goal, target, current, percentage };
}

const rows = data.map((row, idx) =>
  createData(row.goal, row.target, row.current, `${Math.floor(row.current/row.target*100)}%`)
);

export default function Targets(props) {
  const classes = useStyles();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="targets table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Goal</StyledTableCell>
              <StyledTableCell align="left">Target</StyledTableCell>
              <StyledTableCell align="left">Current</StyledTableCell>
              <StyledTableCell align="left">Percentage</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.goal}>
                <StyledTableCell component="th" scope="row">
                  {row.goal}
                </StyledTableCell>
                <StyledTableCell align="left">{row.target}</StyledTableCell>
                <StyledTableCell align="left">{row.current}</StyledTableCell>
                <StyledTableCell align="left">{row.percentage}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
