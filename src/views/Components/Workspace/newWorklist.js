import React from 'react';
import Item from './Item';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
//import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles((theme) => ({
  item: {
    //border: "1px solid green",
    flexGrow: 1
  },
  ul: {
    border: "1px solid purple",
  },
  worklist: {
    border: "1px solid red",
    color: "black",
    fontWeight: "bold",
    padding: "15px"
  }
}));

function filterRecords(worklist, records) {
  //console.log(worklist, records);
  let worklistRecords = [];

  switch (worklist) {
    case 'Queues':
      records.forEach(record => {
        record.tags.forEach(tag => {
          if (tag === 'list_all') worklistRecords.push(record);
        });
      });
      break;
    case 'Today':
      records.forEach(record => {
        record.tags.forEach(tag => {
          if (tag === 'list_today') worklistRecords.push(record);
        });
      });
      break;
    case 'Financial':
      records.forEach(record => {
        record.tags.forEach(tag => {
          if (tag === 'financial') worklistRecords.push(record);
        });
      });
      break;
    default:
      console.log('Eish, is problem');
  }
  //console.log('worklistRecords: ', worklist, worklistRecords);
  return worklistRecords;
}

function Worklist(props) {
  //console.log('Worklist props: ', props);
  const classes = useStyles();

  if (props.worklist.worklist && props.records) {
    const workspace = props.workspace;
    const worklist = props.worklist.worklist;
    //const records = props.records;
    let records = filterRecords(worklist, props.records);
    const tasks = props.tasks;
    const type = props.type;
    const items = props.worklist.items;

    const item = items.map((item, idx) =>
      <Item
        key={idx}
        records={records}
        workspace={workspace}
        worklist={worklist}
        tasks={tasks}
        type={type}
        item={item.item}
        count={item.count} />
    );

    return (
      <>
        <div className={classes.worklist}>{worklist}</div>

          {item}


      </>
    );
  } else {
    return <div>Worklist loading...</div>
  }
}

export default Worklist;
