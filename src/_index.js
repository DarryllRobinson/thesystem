import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from "services/PrivateRoute";

import 'assets/scss/material-kit-react.scss?v=1.9.0';

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

// pages for this product
import Components from 'views/Components/Components.js';
import LandingPage from 'views/LandingPage/LandingPage.js';
import ProfilePage from 'views/ProfilePage/ProfilePage.js';
import LoginPage from 'views/LoginPage/LoginPage.js';

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path='/components' component={Components} />
      <Route path='/profile-page' component={ProfilePage} />
      <Route path='/login-page' component={LoginPage} />
      <Route path='/' component={LandingPage} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
