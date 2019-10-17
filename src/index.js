const axios = require('axios')
const { connect } = require('@holochain/hc-web-client')
const {DNA_PORT, CONDUCTOR_HTTP_PORT, HHA_INSTANCE_ID} = require("./consts")
const { call, pingConductor } = require("./hc_client")
const { do_cloudflare_update, do_cloudflare_get, do_cloudflare_get_list } = require("./kv_updater")


// Examples Data
// const new_enabled_apps = [
//   {
//     app: 'APP-DNA-HASH-1',
//     host: ["Test_HOST_HASH_1"]
//   },
//   {
//     app: 'APP-DNA-HASH-2',
//     host: ["Test_HOST_HASH_2"]
//   }
// ]
// const new_disable_apps = [
//  {
//     app: 'APP-DNA-HASH-2',
//     host:["Test_HOST_HASH_4"]
//   }
// ]

pingConductor().then( async () =>{

  // Registering as Host
  console.log("Registering as Host...");
  await call(HHA_INSTANCE_ID, "host", "register_as_host", {host_doc: {kyc_proof: ""}})

  // Getting data from the HHA to
  const result = await call(HHA_INSTANCE_ID, "host", "get_kv_updates_dna_to_host", {})
  const new_enabled_apps = result.recently_enabled_apps
  console.log("ENABLED: ",new_enabled_apps)
  const new_disable_apps = result.recently_disabled_apps
  console.log("Disabled: ",new_disable_apps)

  // Getting the current data from the KV Store
  const kv_list = await get_old_data()
  console.log("Current KV List: ", kv_list);

  console.log("Updating old data in kv store... ");
  // This code doesnt handle hApps that are set to not be surved on the HHA
  new_list = new_enabled_apps.map((kv)=>{
    let result = kv_list.find((new_app)=>{
      return new_app.app == kv.app})
    if(result==undefined) return kv
    else return {
      app: kv.app,
      host:kv.host.concat(result.host).unique()
    }
  })
  // console.log("Filtered with the enabled apps",new_list);

  // Filtering through the disabled apps
  new_list = new_list.map((kv)=> {
    let result = new_disable_apps.find((disable)=>disable.app == kv.app)
    if(result==undefined) return kv
    else {
      _r = kv.host.filter((_h)=>!result.host.includes(_h))
      return {
        app: kv.app,
        host: _r
      }
    }
  })

  console.log("Data to be updated: ",new_list);

  // Load the KV Store with the new data
  load_kv_store(new_list).then(async()=> {
    // When the load to the kv store is sucessfull the DNA expects you to update it
    await call(HHA_INSTANCE_ID, "host", "kv_updates_host_completed", {kv_bundle: new_enabled_apps.concat(new_disable_apps)})
    console.log("HHA DNA Notified that the kv was updated.");
  })

}).catch((e) => {throw new Error("Script not successful",e)})

// Updates the KV Store
const load_kv_store = async (app_list) => {
  for(j=0; j < app_list.length; j++){
    await do_cloudflare_update(app_list[j].app, JSON.stringify(app_list[j].host))
  }
}

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
  return kv_list
}

// Helper Function
Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
};
