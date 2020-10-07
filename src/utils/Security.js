
export default class Security {

    writeLoginSession(user, loginTime) {
      if (loginTime === null) { alert('loginTime is null'); }

      //console.log('response.data: ', response.data);
      // Create session for logged in user
      //let config = await this.dataLayer.Get('/getconfig');
      //sessionStorage.setItem('foneBookConfig', JSON.stringify(config));
      sessionStorage.setItem('cwsUser', user[0].email);
      sessionStorage.setItem('cwsFirstName', user[0].firstName);
      sessionStorage.setItem('cwsSurname', user[0].surname);
      sessionStorage.setItem('cwsRole', user[0].role);
      sessionStorage.setItem('cwsType', user[0].type);
      sessionStorage.setItem('cwsSession', loginTime);
      sessionStorage.setItem('cwsStoreId', user[0].storeId);
      sessionStorage.setItem('cwsClient', user[0].clientId);
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
    }
}
