import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ComponentRoutes from './ComponentRoutes';
//import NavBar from 'views/Components/NavBar';

export default function AgentWorkspace(props) {
  return (
    <Router>
      <Container fluid>
        {/*<NavBar {...this.props}
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          handleLogoutClick={this.handleLogoutClick}
          loggedInStatus={this.state.loggedInStatus}
          handleSuccessfulAuth={this.handleSuccessfulAuth}
          role={this.state.user.role}
        />*/}
        <ComponentRoutes />
      </Container>
    </Router>
  )
}
