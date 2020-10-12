import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ComponentRoutes from './ComponentRoutes';
//import NavBar from 'views/Components/NavBar';

export default function AgentWorkspace(props) {
  return (
    <Router>
      <Container fluid>
        <ComponentRoutes />
      </Container>
    </Router>
  )
}
