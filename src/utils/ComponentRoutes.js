import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
//import ErrorReporting from 'utils/ErrorReporting';
import Security from 'utils/Security';
//import moment from 'moment';
import { PrivateRoute } from 'services/PrivateRoute';

import Dashboard from 'views/Components/Dashboard.js';
import Workzone from 'views/Components/Workzone.js';
import NavBar from 'views/Components/NavBar';

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
import Reports from 'views/Components/Reports/Reports';
import Targets from 'views/Components/Reports/Targets';
import Victory from 'views/Components/Reports/Victory';

// Excel uploading function
import ExcelReader from 'views/Components/Upload/ExcelReader';
import {CsvUploader} from 'views/Components/Upload/CsvUploader';

const ComponentRoutes = (props) => {
  //console.log('ComponentRoutes props: ', props);
  const role = sessionStorage.getItem('cwsRole');
  const security = new Security();
  security.validateSession();

  function getAccessPaths() {
    switch (role) {
      case 'agent':
        return (
          <React.Fragment>
            <NavBar role={role} />
            <Route exact path="/dashboard" component={Dashboard} />
          </React.Fragment>
        );
      case 'kam':
        return (
          <React.Fragment>
            <NavBar role={role} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute
              exact
              path="/workzone/collections"
              component={Workzone}
            />
            <PrivateRoute
              exact
              path="/workzone/collections/collection/:id"
              component={Collection}
            />
            <PrivateRoute
              exact
              path="/workzone/collections/contacts/:id"
              component={Contacts}
            />

            {/* User */}
            <PrivateRoute
              exact
              path="/user/registration"
              component={UserRegistration}
            />
            <PrivateRoute exact path="/user/admin" component={UserAdmin} />

            {/* Client */}
            <PrivateRoute
              exact
              path="/client/registration"
              component={ClientRegistration}
            />
            <PrivateRoute exact path="/client/admin" component={ClientAdmin} />

            {/* Reports */}
            <PrivateRoute exact path="/reports" component={Reports} />
            <PrivateRoute exact path="/targets" component={Targets} />

            {/* Excel upload */}
            <PrivateRoute
              exact
              path="/collections/upload"
              component={ExcelReader}
            />
            <PrivateRoute
              exact
              path="/collections/csvupload"
              component={CsvUploader}
            />
          </React.Fragment>
        );
      case 'superuser':
        return (
          <React.Fragment>
            <NavBar role={role} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute
              exact
              path="/workzone/collections"
              component={Workzone}
            />
            <PrivateRoute
              exact
              path="/workzone/collections/collection/:id"
              component={Collection}
            />
            <PrivateRoute
              exact
              path="/workzone/collections/contacts/:id"
              component={Contacts}
            />

            {/* User */}
            <PrivateRoute
              exact
              path="/user/registration"
              component={UserRegistration}
            />
            <PrivateRoute exact path="/user/admin" component={UserAdmin} />

            {/* Client */}
            <PrivateRoute
              exact
              path="/client/registration"
              component={ClientRegistration}
            />
            <PrivateRoute exact path="/client/admin" component={ClientAdmin} />

            {/* Reports */}
            <PrivateRoute exact path="/reports" component={Reports} />
            <PrivateRoute exact path="/targets" component={Targets} />
            <PrivateRoute exact path="/victory" component={Victory} />

            {/* Excel upload */}
            <PrivateRoute
              exact
              path="/collections/upload"
              component={ExcelReader}
            />
            <PrivateRoute
              exact
              path="/collections/csvupload"
              component={CsvUploader}
            />
          </React.Fragment>
        );
      default:
        //if (props.history.location.pathname != )
        /*const errorReporting = new ErrorReporting();

        errorReporting.sendMessage({
          error: 'No role found',
          fileName: 'ComponentRoutes.js',
          user: `user: ${sessionStorage.getItem('cwsUser')} role: ${sessionStorage.getItem('cwsRole')}`,
          state: `props: ${JSON.stringify(props)}`,
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          path: props.history.location.pathname
        });*/

        security.terminateSession();
        props.history.push('/login');
    }
  }

  return <Switch>{getAccessPaths()}</Switch>;
};

export default ComponentRoutes;
