const axios = require('axios')
const { connect } = require('@holochain/hc-web-client')
const {DNA_PORT, CONDUCTOR_HTTP_PORT} = require("../consts")

const call = async (instance, zome, zome_fn, params ) => {
  return connect({ url: "ws://localhost:"+DNA_PORT } )
    .then(
      ({callZome, close}) => {
        return callZome(instance, zome, zome_fn)(params).then(r => {
          const result = JSON.parse(r)
          if (result.Ok) {
            close()
            return result.Ok
          }
          else throw new Error('Holochain Error: ',result.Err)
        }
      ).catch(e => {throw new Error('Zome Call Error: ',e)})
  })
}

function pingConductor () {
  return new Promise((resolve, reject) => {
    const callToHC = axios.post("http://localhost:"+CONDUCTOR_HTTP_PORT+"/admin/agent/list", {})
    console.log("Conductor is running...");
    resolve(callToHC)
	})
    .catch((e) => { throw new Error(` \n No Holochain Conductor Found.\n Note: Make sure your HC conductor is running! \n`)})
}

module.exports = { call, pingConductor }
