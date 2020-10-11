import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from 'services/PrivateRoute';
import { Container } from 'react-bootstrap';

import NavBar from 'views/Components/NavBar';
import Dashboard from 'views/Components/Dashboard.js';
import Workzone from 'views/Components/Workzone.js';

// Collections
import Collection from 'views/Components/Collections/Collection';
import Contacts from 'views/Components/Collections/editContacts';

// User admin
import UserRegistration from 'views/Components/User/Registration';
import UserAdmin from 'views/Components/User/Admin';

// Client admin
import ClientRegistration from 'views/Components/Client/Registration';
import ClientAdmin from 'views/Components/Client/Admin';

// Reports
import ExcelReader from 'views/Components/ExcelUpload/ExcelReader';

// Excel uploading function
import Reports from 'views/Components/Reports/Reports';

// Common routes
import Components from 'views/Components/Components.js';
import LandingPage from 'views/LandingPage/LandingPage.js';
import ProfilePage from 'views/ProfilePage/ProfilePage.js';
import LoginPage from 'views/LoginPage/LoginPage.js';

export default function App() {
  return (
    <Switch>
      {getAccessPaths()}
      {commonPaths()}
    </Switch>
  )
}


function getAccessPaths() {
  let role = sessionStorage.getItem('cwsRole');

  switch (role) {
    case 'agent':
      return (
        <React.Fragment>
          <NavBar role={role} />
          <Container style={{ margin: "80px 5px 5px 5px" }}>
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/workzone/collections' component={Workzone} />
            <PrivateRoute exact path='/workzone/collections/collection/:id' component={Collection} />
            <PrivateRoute exact path='/reports' component={Reports} />

            {/* Excel upload */}
            <PrivateRoute exact path='/collections/upload' component={ExcelReader} />
          </Container>
        </React.Fragment>
      )
    case 'superuser':
      return (
        <React.Fragment>
          <NavBar role={role} />
          <Container style={{ margin: "80px 5px 5px 5px" }}>
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/workzone/collections' component={Workzone} />
            <PrivateRoute exact path='/workzone/collections/collection/:id' component={Collection} />
            <PrivateRoute exact path='/workzone/collections/contacts/:id' component={Contacts} />

            {/* User */}
            <PrivateRoute exact path='/user/registration' component={UserRegistration} />
            <PrivateRoute exact path='/user/admin' component={UserAdmin} />

            {/* Client */}
            <PrivateRoute exact path='/client/registration' component={ClientRegistration} />
            <PrivateRoute exact path='/client/admin' component={ClientAdmin} />

            {/* Reports */}
            <PrivateRoute exact path='/reports' component={Reports} />

            {/* Excel upload */}
            <PrivateRoute exact path='/collections/upload' component={ExcelReader} />
          </Container>
        </React.Fragment>
      )
    default:
      return (
        <React.Fragment>
          <Route path='/components' component={Components} />
          <Route path='/profile-page' component={ProfilePage} />
          <Route path='/login-page' component={LoginPage} />
          <Route path='/' component={LandingPage} />
        </React.Fragment>
      )
  }
}

function commonPaths() {
  return (
    <React.Fragment>
      <Route path='/components' component={Components} />
      <Route path='/profile-page' component={ProfilePage} />
      <Route path='/login-page' component={LoginPage} />
      <Route path='/' component={LandingPage} />
    </React.Fragment>
  )
}
