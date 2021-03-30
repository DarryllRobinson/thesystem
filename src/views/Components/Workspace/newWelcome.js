import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    color: 'black',
  },
}));

export default function Welcome(props) {
  let user = props.user ? props.user[0].firstName : '';
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs>
          <h3 className={classes.title}>Welcome to your workspace, {user}</h3>
          <p
            className={classes.title}
          >{`It will provide you with an overview of what's happening and is where you will start your day`}</p>
        </Grid>
      </Grid>
    </div>
  );
}
