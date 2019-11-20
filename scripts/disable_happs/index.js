const { call, pingConductor } = require('../../src/hc_client')
const { HHA_INSTANCE_ID } = require('../../src/consts')

pingConductor().then(async () => {
  const result = await call(HHA_INSTANCE_ID, 'host', 'get_all_apps', {})

  result.forEach(async (app) => {
    // const result = await call(HHA_INSTANCE_ID, 'host', 'disable_app', { app_hash: app.hash })
    console.log('Disabled: ', app.hash)
  })
}).catch((e) => {
  throw new Error('Script not successful', e)
})
