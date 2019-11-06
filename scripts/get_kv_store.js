const { do_cloudflare_get, do_cloudflare_get_list } = require("../src/kv_updater")

// Get all the KV from the KV store
const get_old_data = async () => {
  let key_list = await do_cloudflare_get_list()
  key_list = key_list.result
  let kv_list = []
  for(i=0;i<key_list.length;i++){
    kv_list.push({
      "app": key_list[i].name,
      "host": await do_cloudflare_get(key_list[i].name)
    })
  }
  console.log("Current KV Store:")
  console.log(kv_list)
}

get_old_data()

module.exports = { get_old_data }
