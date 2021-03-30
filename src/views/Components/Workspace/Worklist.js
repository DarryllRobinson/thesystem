import React from 'react';
import Item from './Item';

function filterRecords(worklist, records) {
  //console.log(worklist, records);
  let worklistRecords = [];

  switch (worklist) {
    case 'Queues':
      records.forEach((record) => {
        record.tags.forEach((tag) => {
          if (tag === 'list_all') worklistRecords.push(record);
        });
      });
      break;
    case 'Today':
      records.forEach((record) => {
        record.tags.forEach((tag) => {
          if (tag === 'list_today') worklistRecords.push(record);
        });
      });
      break;
    case 'Financial':
      records.forEach((record) => {
        record.tags.forEach((tag) => {
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
  if (props.worklist.worklist && props.records) {
    const workspace = props.workspace;
    const worklist = props.worklist.worklist;
    //const records = props.records;
    let records = filterRecords(worklist, props.records);
    const tasks = props.tasks;
    const type = props.type;
    const items = props.worklist.items;

    const item = items.map((item, idx) => (
      <Item
        key={idx}
        records={records}
        workspace={workspace}
        worklist={worklist}
        tasks={tasks}
        type={type}
        item={item.item}
        count={item.count}
      />
    ));

    return (
      <div className="col-lg-4">
        <div className="bs-component">
          <ul className="list-group">
            <h5 className="card-subtitle" style={{ padding: '15px' }}>
              {worklist}
            </h5>
            {item}
          </ul>
        </div>
      </div>
    );
  } else {
    return <div>Worklist loading...</div>;
  }
}

export default Worklist;
