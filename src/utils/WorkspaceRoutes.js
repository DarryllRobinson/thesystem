import React from 'react';
import { Switch } from 'react-router-dom';
import AgentWorkspace from './AgentWorkspace';
import { PrivateRoute } from "services/PrivateRoute";

// common routes go here with specific, role-based routes in the relevant component

const WorkspaceRoutes = (props) => {
  return (
    <Switch>
      <PrivateRoute exact path='/dashboard' component={AgentWorkspace} />
    </Switch>
  );
}

export default WorkspaceRoutes;
