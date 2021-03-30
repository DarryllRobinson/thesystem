import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { authenticationService } from 'services';
import Security from 'utils/Security';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      PrivateRoute.propTypes = {
        component: PropTypes.any,
        roles: PropTypes.any,
        location: PropTypes.any,
      };
      const security = new Security();
      security.validateSession();
      const currentUser = authenticationService.currentUserValue;
      //console.log('currentUser: ', currentUser);
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        );
      }

      // check if route is restricted by role
      if (roles && roles.indexOf(currentUser.role) === -1) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: '/' }} />;
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);
