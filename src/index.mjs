import axios from "axios"
import call from "./hc_client.mjs"

const CONDUCTOR_HTTP_PORT = 8080
const INSTANCE_ID = "holo-hosting-app"

const startTestConductor = async () => {
	return new Promise((resolve) => {
		const callToHC = axios.post("http://localhost:"+CONDUCTOR_HTTP_PORT+"/admin/agent/list", {})
		resolve(callToHC)
	}).catch(() => { throw new Error(` \n No Holochain Conductor Found.
			\n Note: Make sure your HC conductor is running! \n`)
	})
}


startTestConductor().then(() =>{

	call(INSTANCE_ID, "whoami","get_user",{})

}).catch(
	() => { throw new Error("Script not successful")
	})
