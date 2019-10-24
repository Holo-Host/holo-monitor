const axios = require('axios')
const { connect } = require('@holochain/hc-web-client')
const {DNA_PORT, CONDUCTOR_HTTP_PORT} = require("../consts")

const call = async (instance, zome, zome_fn, params ) => {
  return connect({ url: "ws://localhost:"+DNA_PORT } )
    .then(
      ({callZome, close}) => {
        return callZome(instance, zome, zome_fn)(params).then(r => {
          const result = JSON.parse(r)
          if (result.Err) {
            console.log("Holochain Error:",result.Err);
            close()
            throw new Error('Holochain Error: ',result.Err)
          }
          else {
            close()
            return result.Ok
          }
        }
      ).catch(e => {
        console.log("Zome Call Error:".result.Err);
        throw new Error('Zome Call Error: ',e)
      })
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
