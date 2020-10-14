import React, { useEffect, useState } from 'react';
//import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Security from 'utils/Security';

import WorkspaceRoutes from 'utils/WorkspaceRoutes';

export default function App(props) {
  const [isLoggedIn, setLogin] = useState(false);
  const security = new Security();

  useEffect(() => {
    setLogin(security.validateSession());
  }, [security, isLoggedIn]);

  return (
    <Router>
      <WorkspaceRoutes />
    </Router>
  )
}
