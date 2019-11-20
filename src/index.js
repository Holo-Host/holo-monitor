const CronJob = require('cron').CronJob
const { main } = require('./main.js')

// This CronJob will run every 5 mins
// rewrite this without 'new'
// for now disable linter complaint
// eslint-disable-next-line
new CronJob('*/ * * * *', function () {
  console.log('Starting CronJob...')
  main()
}, null, true, 'America/Los_Angeles')
