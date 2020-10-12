import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AgentWorkspace from './AgentWorkspace';
import { PrivateRoute } from "services/PrivateRoute";

// Common routes
import Components from 'views/Components/Components.js';
import LandingPage from 'views/LandingPage/LandingPage.js';
import ProfilePage from 'views/ProfilePage/ProfilePage.js';
import LoginPage from 'views/LoginPage/LoginPage.js';

// common routes go here with specific, role-based routes in the relevant component

const WorkspaceRoutes = (props) => {

  return (
    <>
      <Switch>
        <Route path='/components' component={Components} />
        <Route path='/profile-page' component={ProfilePage} />
        <Route path='/login' component={LoginPage} />
        <PrivateRoute exact path='/dashboard' component={AgentWorkspace} />
        <Route path='/' component={LandingPage} />
      </Switch>
    </>
  );
}

export default WorkspaceRoutes;
