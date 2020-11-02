// https://jasonwatmore.com/post/2019/02/01/react-role-based-authorization-tutorial-with-example#fake-backend-js
import { BehaviorSubject } from 'rxjs';

//import config from 'config';
import MysqlLayer from 'utils/MysqlLayer';
import Security from 'utils/Security';
import { handleResponse } from 'services';

const currentUserSubject = new BehaviorSubject(sessionStorage.getItem('cwsToken'));

export const authenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue () { return currentUserSubject.value }
};

function login(userCredentials) {
  //console.log('login userCredentials: ', userCredentials);
  const mysqlLayer = new MysqlLayer();
  const security = new Security();

  return mysqlLayer.PostLogin(`/admin/sessions/`, userCredentials)
    .then(handleResponse)
    .then(user => {
      console.log('writing user details: ', user);
      if (user.error) {
        console.log('return error');
        return { error: user };
      }
      security.writeLoginSession(user.user, userCredentials.loginDate)
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      //localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user.user);

      return user;
    }
  );
}

function logout() {
    // remove user from session storage to log user out
    const security = new Security();
    security.terminateSession();
    currentUserSubject.next(null);
    window.location.href = '/';
}
