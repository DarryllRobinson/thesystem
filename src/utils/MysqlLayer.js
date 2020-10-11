import axios from 'axios';
import AppSettings from './appSettings';
import Security from './Security';
import moment from 'moment';
import { authenticationService } from 'services';

export default class MysqlLayer {

  security = new Security();

  /*async _Get(path) {
    try {
      await axios.get(`${AppSettings.serverEndpoint}${path}`, this.setHeaders()
        ).then(handleResponse);
    }
    catch(e) {
      console.log('Get try/catch error: ', e);
    }
  }*/

  // Get route
  async Get(path) {
    this.security.validateSession();

    try {
      //console.log(`Getting from ${AppSettings.serverEndpoint}${path}`);
      let response = await axios.get(`${AppSettings.serverEndpoint}${path}`, this.setHeaders());
      return response.data;
    } catch(e) {
      console.log('e: ', e);
      this.sendMessage(
        {
          error: `Get error: ${e}`,
          fileName: 'MysqlLayer.js',
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          user: sessionStorage.getItem('cwsUser'),
          state: null,
          path: path
        }
      );
      if (!e.response) {
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  // Post route
  async Post(path, object) {
    this.security.validateSession();

    try {
      //console.log(`Posting to ${AppSettings.serverEndpoint}${path}`);
      let response = await axios.post(`${AppSettings.serverEndpoint}${path}`, object, this.setHeaders());
      //console.log('response: ', response);
      return response;
    } catch(e) {
      console.log('e: ', e);
      this.sendMessage(
        {
          error: `Post error: ${e}`,
          fileName: 'MysqlLayer.js',
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          user: sessionStorage.getItem('cwsUser'),
          path: path,
          state: null,
          object: JSON.stringify(object)
        }
      );
      if (!e.response) {
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  // Post route for Login only as there is no validateSession
  async PostLogin(path, object) {
    //this.security.validateSession();
    //console.log('path: ', path);
    //console.log('object: ', object);
    try {
      //console.log(`Posting login to from ${AppSettings.serverEndpoint}${path}`);
      let user = await axios.post(`${AppSettings.serverEndpoint}${path}`, object);
      //console.log('user: ', user);
      return user;
    } catch(e) {
      console.log('e: ', e);
      this.sendMessage(
        {
          error: `PostLogin error: ${e}`,
          fileName: 'MysqlLayer.js',
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          path: path,
          state: null,
          object: JSON.stringify(object)
        }
      );
      if (!e.response) {
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  // Post route for Change only as there is no validateSession
  async PostChange(path, object) {
    //this.security.validateSession();
    //console.log('path: ', path);
    //console.log('object: ', object);
    try {
      //console.log(`Posting login to from ${AppSettings.serverEndpoint}${path}`);
      let response = await axios.post(`${AppSettings.serverEndpoint}${path}`, object, this.setHeaders());
      console.log('response: ', response);
      return response;
    } catch(e) {
      console.log('e: ', e);
      this.sendMessage(
        {
          error: `PostChange error: ${e}`,
          fileName: 'MysqlLayer.js',
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          user: sessionStorage.getItem('cwsUser'),
          path: path,
          state: null,
          object: JSON.stringify(object)
        }
      );
      if (!e.response) {
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  // Put route
  async Put(path, object) {
    this.security.validateSession();

    try {
      //console.log(`Putting into ${AppSettings.serverEndpoint}${path}`);
      let response = await axios.put(`${AppSettings.serverEndpoint}${path}`, object, this.setHeaders());
      return response.data;
    } catch(e) {
      console.log('e: ', e);
      this.sendMessage(
        {
          error: `Put error: ${e}`,
          fileName: 'MysqlLayer.js',
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          user: sessionStorage.getItem('cwsUser'),
          path: path,
          state: null,
          object: JSON.stringify(object)
        }
      );
      if (!e.response) {
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  // Delete route
  async Delete(path) {
    this.security.validateSession();

    try {
      //console.log(`Deleting from ${AppSettings.serverEndpoint}${path}`);
      let response = await axios.delete(`${AppSettings.serverEndpoint}${path}`, this.setHeaders());
      return response.data;
    } catch(e) {
      console.log('e: ', e);
      this.sendMessage(
        {
          error: `Post error: ${e}`,
          fileName: 'MysqlLayer.js',
          dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          user: sessionStorage.getItem('cwsUser'),
          state: null,
          path: path
        }
      );
      if (!e.response) {
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  setHeaders() {
    const https = require('https');
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    let token = currentUser ? currentUser.token : null;
    //console.log('currentUser: ', currentUser.token);
    let user = sessionStorage.getItem('cwsUser');
    //console.log('user: ', user);

  //  if (currentUser && currentUser.token) {
      return {
        headers: {
          "Accept": "application/json, application/x-www-form-urlencoded",
          "Content-Type": "application/json",
          'User': user,
          'Authorization': `Bearer ${token}`
        }
        /*headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Origin, Methods, Content-Type",

        }*/
        , httpsAgent: new https.Agent({ rejectUnauthorized: false, withCredentials: true }),
        //user: user
      }
  //  } else {
    //  return {};
  //  }
  }

  async sendMessage(msgObject) {
    msgObject.purpose = 'error';
    msgObject.to = 'darryll@thesystem.co.za';
    msgObject.subject = 'ALERT! Error picked up!';

    await axios.post(`${AppSettings.serverEndpoint}/admin/email`, msgObject
      ).then(response => {
        console.log('response: ', response);
      }
    );
  }
}
