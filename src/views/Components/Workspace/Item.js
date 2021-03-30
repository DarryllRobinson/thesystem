import React from 'react';
import { Link } from 'react-router-dom';

/*function sectionToRender(workspace, worklist, records, task, type, item, count) {
  //console.log('sectionToRender ', worklist, tasks);
  let section = (<div>section</div>);

  section = (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <Link className="nav-link"
        to={{
          pathname: `/workzone/${workspace}`,
          state: {
            recordStatus: item,
            records: records,
            task: task,
            type: type,
            workspace: workspace
          }
        }}
        style={{padding: 0}}
      >
        {item} - {task}
      </Link>
      <span className="badge badge-primary badge-pill">{count}</span>
    </li>
  );

  return section;

}*/

function Item(props) {
  //console.log('Item props: ', props);
  const workspace = props.workspace;
  //const worklist = props.worklist;
  const records = props.records;
  //const tasks = props.tasks;
  const type = props.type;
  const item = props.item;
  const count = props.count;

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <Link
        className="nav-link"
        to={{
          pathname: `/workzone/${workspace}`,
          state: {
            recordStatus: item,
            records: records,
            type: type,
            workspace: workspace,
          },
        }}
        style={{ padding: 0 }}
      >
        {item}
      </Link>
      <span className="badge badge-primary badge-pill">{count}</span>
    </li>
  );
}

/*function oldItem(props) {
  //console.log('Item props: ', props);
  if (props.workspace) {
    //console.log('Item props records: ', props.records);
    const workspace = props.workspace;
    const records = props.records;
    const tasks = props.tasks;
    const type = props.type;
    const item = props.item;
    const count = props.count;

    tasks.forEach(task => {
      console.log('Item task: ', task, item, count);
      if (task === 'list_all') {
        //console.log('list_all in Item.js');
        let itemRecords = [];
        records.forEach(record => {
          record.tags.forEach(tag => {
            if (tag === task) itemRecords.push(record);
          });
        });

        return (

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <Link className="nav-link"
              to={{
                pathname: `/workzone/${workspace}`,
                state: {
                  recordStatus: item,
                  records: itemRecords,
                  type: type,
                  workspace: workspace
                }
              }}
              style={{padding: 0}}
            >
              {item}
            </Link>
            <span className="badge badge-primary badge-pill">{count}</span>
          </li>
        );

      } else if (task === 'list_today') {
        //console.log('list_today in Item.js');
        let itemRecords = [];
        records.forEach(record => {
          record.tags.forEach(tag => {
            if (tag === task) {
              itemRecords.push(record);
              //console.log('list_today record: ', record);
            }
          });
        });

        //console.log('list_today: ', itemRecords);

        return (
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <Link className="nav-link"
              to={{
                pathname: `/workzone/${workspace}`,
                state: {
                  recordStatus: item,
                  records: itemRecords,
                  type: type,
                  workspace: workspace
                }
              }}
              style={{padding: 0}}
            >
              {item}
            </Link>
            <span className="badge badge-primary badge-pill">{count}</span>
          </li>
        );
      } else {
        console.log('No Item to render');
        return (
          <div>No Item to render</div>
        );
      }

    });


  } else {
    return (
      <div>Loading items...</div>
    )
  }
}*/

export default Item;
