/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  const https = require('https')
  console.log("Ejecutando desde el bootsrap")

  var cron = require('cron');

  var job1 = new cron.CronJob({
    cronTime: '* * * * *',
    onTick: function () {
      console.log('job 1 ticked');
      /////////////////////////////////////////////////////////////////////
      https.get('https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=60&aggregate=3&e=CCCAGG', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          var contenido = JSON.parse(data)
          console.log(contenido.Data.length)
          var row = []
          contenido.Data.forEach(function (element) {
            row.push({
              time: element.time,
              close: element.close,
              high: element.high,
              low: element.low,
              open: element.open,
              volumefrom: element.volumefrom,
              volumeto: element.volumeto
            })
          });
          Moneda.create(row).exec(function (error, resp) {
            if (!error) { console.log(resp) }
            else { console.log(error) }
          })
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
      /////////////////////////////////////////////////////////////////////
    },
    start: false,
    timeZone: 'America/Los_Angeles'
  });

  console.log('job1 status', job1.running); // job1 status undefined
  job1.start(); // job 1 started
  console.log('job1 status', job1.running); // job1 status true

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
