
export default class Security {

    writeLoginSession(user, loginTime) {
      //console.log('writeLoginSession user: ', user);
      if (loginTime === null || loginTime === undefined) { alert('loginTime is null or undefined'); }

      //console.log('response.data: ', response.data);
      // Create session for logged in user
      //let config = await this.dataLayer.Get('/getconfig');
      //sessionStorage.setItem('foneBookConfig', JSON.stringify(config));
      sessionStorage.setItem('cwsUser', user.email);
      sessionStorage.setItem('cwsFirstName', user.firstName);
      sessionStorage.setItem('cwsSurname', user.surname);
      sessionStorage.setItem('cwsRole', user.role);
      sessionStorage.setItem('cwsType', user.type);
      sessionStorage.setItem('cwsSession', loginTime);
      sessionStorage.setItem('cwsStoreId', user.storeId);
      sessionStorage.setItem('cwsClient', user.clientId);
      sessionStorage.setItem('cwsToken', user.token);
    }

    validateSession() {
      let session = sessionStorage.getItem('cwsSession');

      let sessionAgeMilliseconds = (new Date()) - (new Date(sessionStorage.getItem('cwsSession')));
        let sessionAgeSeconds = Math.floor(sessionAgeMilliseconds / 1000);

        //30 Minute Time-Out (1800 seconds)
        if (sessionAgeSeconds >= 1800) {
          //console.log('1');
            this.terminateSession();
            window.location = '/';
        } else if (session === null) {
          //console.log('2');
          this.terminateSession();
        }
        else {
          //console.log('3');
            this.extendSession();
        }
    }

    extendSession() {
        sessionStorage.setItem('cwsSession', new Date().toString());
    }

    terminateSession() {
      sessionStorage.removeItem('cwsUser', null);
      sessionStorage.removeItem('cwsFirstName', null);
      sessionStorage.removeItem('cwsSurname', null);
      sessionStorage.removeItem('cwsRole', null);
      sessionStorage.removeItem('cwsSession', null);
      sessionStorage.removeItem('cwsStoreId', null);
      sessionStorage.removeItem('cwsClient', null);
      sessionStorage.removeItem('cwsType', null);
      sessionStorage.removeItem('cwsToken', null);
    }
}
