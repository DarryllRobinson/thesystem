import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  li: {
    border: "10px solid black",
    color: "green",
    display: 'flex',
    //justifyContent: "flex-end",
    //justifyContent: "flex",
  },
  link: {
    border: "3px solid yellow",
    color: "blue",
    padding: "10px",
    width: "100%"
  },
  span: {
    backgroundColor: 'blue',
    border: "3px solid purple",
    color: "white",
    fontWeight: "bold",
    //justifyContent: "flex-end",
    margin: "10px",
    padding: "7px",
  }
}));

function Item(props) {
  //console.log('Item props: ', props);
  const workspace = props.workspace;
  //const worklist = props.worklist;
  const records = props.records;
  //const tasks = props.tasks;
  const type = props.type;
  const item = props.item;
  const count = props.count;
  const classes = useStyles();

  return (
    <>
      {/*<ListItem alignItems="flex-start">*/}
      <ListItem>
        <ListItemText className={classes.li}
          primary={
            <Link className={classes.link}
              to={{
                pathname: `/workzone/${workspace}`,
                state: {
                  recordStatus: item,
                  records: records,
                  type: type,
                  workspace: workspace
                }
              }}
            >
              {item}
            </Link>
          }
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.span}
                color="textPrimary"
              >
                {count}
              </Typography>

            </React.Fragment>
          }
        >
        </ListItemText>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}

export default Item;
