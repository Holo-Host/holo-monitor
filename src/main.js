const { HHA_INSTANCE_ID } = require('./consts')
const { call, pingConductor } = require('./hc_client')
const { doCloudflareUpdate, doCloudflareGet, doCloudflareGetList } = require('./kv_updater')

// Examples Data
// const newEnabledApps = [
//   {
//     app: 'APP-DNA-HASH-1',
//     host: ['Test_HOST_HASH_1']
//   },
//   {
//     app: 'APP-DNA-HASH-2',
//     host: ['Test_HOST_HASH_2']
//   }
// ]
// const newDisableApps = [
//  {
//     app: 'APP-DNA-HASH-2',
//     host:['Test_HOST_HASH_4']
//   }
// ]

const main = () => {
  pingConductor().then(async () => {
    // Registering as Host
    console.log('Registering as Host...')
    await call(HHA_INSTANCE_ID, 'host', 'register_as_host', { host_doc: { kyc_proof: '' } })

    // Getting data from the HHA to
    const result = await call(HHA_INSTANCE_ID, 'host', 'get_kv_updates_dna_to_host', {})
    const newEnabledApps = result.recently_enabled_apps
    console.log('ENABLED: ', newEnabledApps)
    const newDisableApps = result.recently_disabled_apps
    console.log('Disabled: ', newDisableApps)

    // Getting the current data from the KV Store
    const kvList = await getOldData()
    console.log('Current KV List: ', kvList)

    console.log('Updating old data in kv store... ')
    // This code doesnt handle hApps that are set to not be surved on the HHA
    let newList = newEnabledApps.map((kv) => {
      const result = kvList.find((newApp) => {
        return newApp.app === kv.app
      })
      if (result === undefined) return kv
      else {
        return {
          app: kv.app,
          host: kv.host.concat(result.host).unique()
        }
      }
    })
    // console.log('Filtered with the enabled apps',newList)

    // Filtering through the disabled apps
    newList = newList.map((kv) => {
      const result = newDisableApps.find((disable) => disable.app === kv.app)
      if (result === undefined) return kv
      else {
        const _r = kv.host.filter((_h) => !result.host.includes(_h))
        return {
          app: kv.app,
          host: _r
        }
      }
    })

    console.log('Data to be updated: ', newList)

    // Load the KV Store with the new data
    loadKVStore(newList).then(async () => {
      // When the load to the kv store is sucessfull the DNA expects you to update it
      await call(HHA_INSTANCE_ID, 'host', 'kv_updates_host_completed', { kv_bundle: newEnabledApps.concat(newDisableApps) })
      console.log('HHA DNA Notified that the kv was updated.')
    })
  }).catch((e) => {
    throw new Error('Script not successful', e)
  })
}
main()

// Updates the KV Store
const loadKVStore = async (appList) => {
  for (var j = 0; j < appList.length; j++) {
    await doCloudflareUpdate(appList[j].app, JSON.stringify(appList[j].host))
  }
}

// Get all the KV from the KV store
const getOldData = async () => {
  let keyList = await doCloudflareGetList()
  keyList = keyList.result
  const kvList = []
  for (var i = 0; i < keyList.length; i++) {
    kvList.push({
      app: keyList[i].name,
      host: await doCloudflareGet(keyList[i].name)
    })
  }
  return kvList
}

// Helper Function
// rewrite this if desired to avoid linter complaint
// for now disable linter complaint
// eslint-disable-next-line
Array.prototype.unique = function () {
  var a = this.concat()
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1)
      }
    }
  }
  return a
}

module.exports = { main }
