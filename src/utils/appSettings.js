let AppSettings = null;
switch (process.env.REACT_APP_STAGE) {
  case 'development':
    AppSettings = { serverEndpoint: 'http://localhost:8080/api' };
    break;
  case 'production':
    AppSettings = { serverEndpoint: 'https://thesystem.co.za/integration' };
    break;
  case 'sit':
    AppSettings = {
      serverEndpoint: 'https://sit.thesystem.co.za/sitintegration',
    };
    break;
  case 'uat':
    AppSettings = {
      serverEndpoint: 'https://uat.thesystem.co.za/uatintegration',
    };
    break;
  default:
    AppSettings = { serverEndpoint: 'http://localhost:8080/api' };
    break;
}

export default AppSettings;
//serverEndpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : 'https://thesystem.co.za/integration'//'cp50.domains.co.za:8081/api'
