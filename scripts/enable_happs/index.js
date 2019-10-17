const { call, pingConductor } = require("../../src/hc_client")
const {DNA_PORT, CONDUCTOR_HTTP_PORT, HHA_INSTANCE_ID, HS_INSTANCE_ID} = require("../../src/consts")

pingConductor().then( async() =>{
	let result = await call(HHA_INSTANCE_ID, "host","get_all_apps",{})

	// Enable app
  result.forEach(async (app) => {
    await call(HHA_INSTANCE_ID, "host","enable_app",{app_hash:app.hash})
		console.log("Enabled: ", app.hash);
	})


}).catch((e) => {throw new Error("Script not successful",e)})
