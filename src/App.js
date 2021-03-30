import React, { useEffect, useState } from 'react';
//import { Route, Switch } from 'react-router-dom';
import { Route, Router, Switch } from 'react-router-dom';
import Security from 'utils/Security';
import { history } from 'services/history';

//import WorkspaceRoutes from 'utils/WorkspaceRoutes';
import AgentWorkspace from 'utils/AgentWorkspace';
import { PrivateRoute } from 'services/PrivateRoute';

// Common routes
import Roadmap from 'views/Components/Roadmap/Roadmap.js';
import Pricing from 'views/Components/Pricing/Pricing.js';
import LandingPage from 'views/LandingPage/LandingPage.js';
import ProfilePage from 'views/ProfilePage/ProfilePage.js';
import LoginPage from 'views/LoginPage/LoginPage.js';

export default function App() {
  const [isLoggedIn, setLogin] = useState(false);
  const security = new Security();

  useEffect(() => {
    setLogin(security.validateSession());
    //if (!isLoggedIn) history.push('/');
  }, [security, isLoggedIn]);

  return (
    <Router history={history}>
      <Switch>
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/profile-page" component={ProfilePage} />
        <Route path="/login" component={LoginPage} />
        {/*<WorkspaceRoutes />*/}
        <Route exact path="/" component={LandingPage} />
        <PrivateRoute component={AgentWorkspace} />
      </Switch>
    </Router>
  );
}
