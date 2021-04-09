import React from 'react';
//import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import Victory from './Reports/Victory';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function DashboardGrid(props) {
  /* eslint-disable react/prop-types */
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={8}>
          <Paper className={classes.paper}>{props.workspace}</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
