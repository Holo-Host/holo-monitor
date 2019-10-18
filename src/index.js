const axios = require('axios')
const { connect } = require('@holochain/hc-web-client')
const {DNA_PORT, CONDUCTOR_HTTP_PORT, HHA_INSTANCE_ID} = require("./consts")
const { call, pingConductor } = require("./hc_client")

pingConductor().then( async () =>{

	// TODO: Write logic
	// Call HHA DNA to get kv data
	// Used that data to update the KV store

  await call(HHA_INSTANCE_ID, "host", "register_as_host", {host_doc: {kyc_proof: ""}})

  const result = await call(HHA_INSTANCE_ID, "host", "get_kv_updates_dna_to_host", {})

  const enabled_apps = result.recently_enabled_apps
  console.log("ENABLED: ",enabled_apps)
  const disabled_apps = result.recently_disabled_apps
  console.log("Disabled: ",disabled_apps)

}).catch((e) => {throw new Error("Script not successful",e)})
