import { authenticationService } from '../services';

export function handleResponse(response) {
  //console.log('handleResponse response: ', response);
  if (response.data.ok === undefined) {
    //console.log('undefined');
    if ([401, 403].indexOf(response.data.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      authenticationService.logout();
      window.location.reload(true);
    }

    const error = response.data.text || response.statusText;
    //console.log('error to be returned: ', error);
    return error;
  }

  //console.log('response.data: ', response.data);
  return response.data.text;

  /*return response.data.text().then(text => {
  //return response.data().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        authenticationService.logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });*/
}
