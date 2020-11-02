import React from 'react';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { authenticationService } from 'services';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.menuToDisplay = this.menuToDisplay.bind(this);
  }

  menuToDisplay() {
    //console.log('NavBar props: ', this.props);
    //console.log('NavBar loggedInStatus: ', this.props.loggedInStatus);
    const role = this.props.role;
    if (role === "superuser") {
      let firstName = sessionStorage.getItem('cwsFirstName');

      return (
        <>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/collections/upload">Upload</Nav.Link>
          <Nav.Link href="/reports">Reports</Nav.Link>

          <NavDropdown title="Admin" id="admin-dropdown">
            <NavDropdown.Item href="/client/admin">Client</NavDropdown.Item>
            <NavDropdown.Item href="/user/admin">User</NavDropdown.Item>
          </NavDropdown>

          <Container>
            <Navbar.Text>
              {firstName}
            </Navbar.Text>
          </Container>
          <Button
            onClick={() => authenticationService.logout()}
            style={{
              background: "#48B711",
              borderColor: "#48B711"
            }}
          >
            Logout
          </Button>
        </>
      );
    } else if (role === "kam") {
      let firstName = sessionStorage.getItem('cwsFirstName');

      return (
        <>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/collections/upload">Upload</Nav.Link>
          <Nav.Link href="/reports">Reports</Nav.Link>

          <NavDropdown title="Admin" id="admin-dropdown">
            <NavDropdown.Item href="/client/admin">Client</NavDropdown.Item>
            <NavDropdown.Item href="/user/admin">User</NavDropdown.Item>
          </NavDropdown>

          <Container>
            <Navbar.Text>
              {firstName}
            </Navbar.Text>
          </Container>
          <Button
            onClick={() => authenticationService.logout()}
            style={{
              background: "#48B711",
              borderColor: "#48B711"
            }}
          >
            Logout
          </Button>
        </>
      );
    } else if (role === "client") {
      let firstName = sessionStorage.getItem('cwsFirstName');

      return (
        <>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          {/*<Nav.Link href="/collections/upload">Upload</Nav.Link>
          <Nav.Link href="/reports">Reports</Nav.Link>*/}

          <Container>
            <Navbar.Text>
              {firstName}
            </Navbar.Text>
          </Container>
          <Button
            onClick={() => authenticationService.logout()}
            style={{
              background: "#48B711",
              borderColor: "#48B711"
            }}
          >
            Logout
          </Button>
        </>
      );
    } else {
      let firstName = sessionStorage.getItem('cwsFirstName');

      return (
        <>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>

          <Container expand="lg" className="justify-content-end">
            <Navbar.Text>
              {firstName}
            </Navbar.Text>
          </Container>
          <Button onClick={() => authenticationService.logout()}>Logout</Button>
        </>
      );
    }
  }

  nametoDisplay() {
    //console.log('process.env.REACT_APP_STAGE: ', process.env.REACT_APP_STAGE);
    switch (process.env.REACT_APP_STAGE) {
      case 'development':
        return ('The System - Dev');
      case 'production':
        return ('The System');
      case 'sit':
        return ('The System - SIT');
      case 'uat':
        return ('The System - UAT');
      default:
        return ('The System - ???');
    }
  }

  colourToUse() {
    switch (process.env.REACT_APP_STAGE) {
      case 'development':
        return ("dark");
      case 'production':
        return ("dark");
      case 'sit':
        return ("dark");
      case 'uat':
        return ("dark");
      default:
        return ('light');
    }
  }

  render() {
    return (
      <Navbar collapseOnSelect bg={this.colourToUse()} expand="lg" variant={this.colourToUse()} fixed="top">
        <Navbar.Brand href='/'>
          {this.nametoDisplay()}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {this.menuToDisplay()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
