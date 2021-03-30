import React from 'react';
import Worklist from './Worklist';
import AppButton from '../Applications/AppButton';

function Workspace(props) {
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
        <h3 className="card-title">{workspaceCapitalised}</h3>
        <AppButton workspace={workspace} />
        <div className="row">{worklist}</div>
      </>
    );
  } else {
    return <div>Workspace loading...</div>;
  }
}

export default Workspace;
