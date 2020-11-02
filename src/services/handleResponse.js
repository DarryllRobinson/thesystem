import { authenticationService } from 'services';

export function handleResponse(response) {
  if (response.data.ok === undefined) {
    if ([401, 403].indexOf(response.data.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      authenticationService.logout();
      window.location.reload(true);
    }

    const error = response.data.text || response.statusText;
    //console.log('error: ', error);
    return { error: error };
  }

  return { user: response.data.text };
}
