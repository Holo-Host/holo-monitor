const { doCloudflareGet, doCloudflareGetList } = require('../src/kv_updater')

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
  console.log('Current KV Store:')
  console.log(kvList)
}
// getOldData()
module.exports = { getOldData }
