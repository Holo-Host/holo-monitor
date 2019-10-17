const axios = require('axios')
const { connect } = require('@holochain/hc-web-client')
const {DNA_PORT, CONDUCTOR_HTTP_PORT, INSTANCE_ID} = require("./consts")

function startTestConductor () {
  return new Promise((resolve, reject) => {
    console.log("DNA: ",DNA_PORT)
		const callToHC = axios.post("http://localhost:"+CONDUCTOR_HTTP_PORT+"/admin/agent/list", {})
		resolve(callToHC)
	})
    .catch((e) => { throw new Error(` \n No Holochain Conductor Found.\n Note: Make sure your HC conductor is running! \n`)})
}

startTestConductor().then(() =>{

	// TODO: Write logic
	// Call HHA DNA to get kv data
	// Used that data to update the KV store

	connect({ url: "ws://localhost:"+DNA_PORT } ).then(({callZome, close}) => {
    // Register as Host
		callZome(INSTANCE_ID, "host","register_as_host")({host_doc: {kyc_proof: ""}}).then( r => {
			console.log("Registered Successfully:",JSON.parse(r).Ok )

			// WPI: Updating the hash2tranche kv store
			callZome(INSTANCE_ID, "host","get_kv_updates_dna_to_host")({}).then( r => {
				const apps = JSON.parse(r)
				let enabled_apps
				let disabled_apps
				if (apps.Ok) {

					enabled_apps = apps.Ok.recently_enabled_apps
					console.log("ENABLED: ",enabled_apps)
					disabled_apps = apps.Ok.recently_disabled_apps
					console.log("Disabled: ",disabled_apps)

				}
				else throw new Error("HolochainError: ",e)

				close()

			}).catch(() => {throw new Error("Unable Get hash2tranche")})



		}).catch(() => {throw new Error("Unable to Register as Host: ")})

	})

}).catch((e) => {throw new Error("Script not successful",e)})
