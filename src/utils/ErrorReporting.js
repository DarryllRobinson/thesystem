import MysqlLayer from './MysqlLayer';

export default class ErrorReporting {
  mysqlLayer = new MysqlLayer();

  sendMessage(msgObject) {
    /* these fields are required
    purpose
    to
    subject
    error
    fileName
    user
    state
    dateTime
    path
    */
    //console.log('msgObject before: ', msgObject);
    msgObject.purpose = 'error';
    msgObject.to = 'darryll@thesystem.co.za';
    msgObject.subject = 'ALERT! Error picked up!';

    this.mysqlLayer.Post(`/admin/error_email`, msgObject);
  }
}
