import React, { useEffect, useState } from 'react';
//import { Route, Switch } from 'react-router-dom';
import {  Router } from 'react-router-dom';
import Security from 'utils/Security';
import { history } from 'services/history';

import WorkspaceRoutes from 'utils/WorkspaceRoutes';

export default function App() {
  const [isLoggedIn, setLogin] = useState(false);
  const security = new Security();

  useEffect(() => {
    setLogin(security.validateSession());
    if (!isLoggedIn) history.push('/');
  }, [security, isLoggedIn]);

  return (
    <Router history={history}>
      <WorkspaceRoutes />
    </Router>
  )
}
