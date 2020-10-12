import React from 'react';
//import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import WorkspaceRoutes from 'utils/WorkspaceRoutes';

export default function App() {
  return (
    <Router>
      <WorkspaceRoutes />
    </Router>
  )
}
