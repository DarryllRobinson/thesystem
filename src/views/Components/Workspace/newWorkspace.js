import React from 'react';
import Worklist from './Worklist';
import AppButton from '../Applications/AppButton';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  list: {
    border: '2px solid orange',
    width: '100%',
  },
  workspace: {
    border: '2px solid brown',
    color: 'black',
    fontWeight: 'bold',
  },
}));

function Workspace(props) {
  const classes = useStyles();
  //console.log('Workspace props: ', props);
  if (props.workspaces.workspace) {
    //console.log('Workspace props loaded: ', props, moment(new Date()).milliseconds());
    const workspace = props.workspaces.workspace;
    const records = props.records;
    const tasks = props.tasks;
    const type = props.type;
    const workspaceCapitalised =
      workspace.charAt(0).toUpperCase() + workspace.slice(1);
    const worklists = props.workspaces.worklists;
    //console.log('Workspace worklists: ', worklists);

    const worklist = worklists.map((worklist, idx) => {
      //console.log('worklist idx: ', worklist, idx);
      return (
        <Worklist
          key={idx}
          records={records}
          workspace={workspace}
          worklist={worklist}
          tasks={tasks}
          type={type}
          items={worklist.items}
        />
      );
    });

    //console.log('Worklists created in workspace: ', worklists);

    return (
      <>
        <h3 className={classes.workspace}>{workspaceCapitalised}</h3>
        <AppButton workspace={workspace} />
        <List className={classes.list}>{worklist}</List>
      </>
    );
  } else {
    return <div>Workspace loading...</div>;
  }
}

export default Workspace;
