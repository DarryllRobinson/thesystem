import MysqlLayer from '../../Utilities/MysqlLayer';

export default class Vet {
  mysqlLayer = new MysqlLayer();

  async Declines(app) {
    try {
      let declines = await this.mysqlLayer.Get('/maintenance/declines');

      // Run through all decline polcies to check if the app should be auto declined
      let cont = true;
      declines.forEach((decline) => {
        let appDate = new Date();
        const age = (appDate - new Date(app.dob)) / 1000 / 60 / 60 / 24 / 365;
        if (age < 18) cont = false;
      });

      return cont;
    } catch (e) {
      console.log('e: ', e);
      if (!e.response) {
        //alert('Major Get request error: ', e);
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }

  async Scorecard(app) {
    try {
      let scorecard = await this.mysqlLayer.Get('/maintenance/scorecards');

      let score = 0;
      // Run through each characteristic of the scorecard
      scorecard.forEach((card) => {
        if (card.operational === 1) {
          // Check each characteristic to calculate points
          if (card.code === 'S001' && app.sex === card.answer) {
            score = score + card.points;
          }

          if (
            card.code === 'S002' &&
            app.numDependents === parseInt(card.answer)
          ) {
            score = score + card.points;
          }
        }
      });

      return score;
    } catch (e) {
      console.log('e: ', e);
      if (!e.response) {
        //alert('Major Get request error: ', e);
        return e;
      }
      if (e.response.status === 500) {
        alert('Get request 500 error: ' + e.response.data.message);
      } else {
        alert('Get request error: ' + e);
      }
    }
  }
}
