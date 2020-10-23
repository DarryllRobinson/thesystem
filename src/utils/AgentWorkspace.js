import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ComponentRoutes from './ComponentRoutes';
//import NavBar from 'views/Components/NavBar';
import Container from '@material-ui/core/Container';

export default function AgentWorkspace(props) {
  return (
    <Router>
      <Container style={{ marginTop: "80px" }}>
        <ComponentRoutes />
      </Container>
    </Router>
  )
}
