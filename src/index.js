const CronJob = require('cron').CronJob;
const { main } = require('./main.js')

// This CronJob will run every 5 mins
new CronJob('*/ * * * *', function() {
  console.log('Starting CronJob...');
  main()
}, null, true, 'America/Los_Angeles');
