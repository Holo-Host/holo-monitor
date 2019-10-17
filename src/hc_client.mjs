import hc from "@holochain/hc-web-client"

const DNA_PORT = 8800

export default function call (INSTANCE_ID, zome, zome_fn, params){
	hc.connect("ws://localhost:"+DNA_PORT).then(({callZome, close}) => {
		callZome(INSTANCE_ID, zome, zome_fn)(params).then( r => {
			console.log(r)
			close()
		}).catch(() => {
			throw new Error("Unable to make zomecall: "+zome+"/"+zome_fn)
		})
	})
}
