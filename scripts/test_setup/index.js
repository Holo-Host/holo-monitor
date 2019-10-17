const {DNA_PORT, CONDUCTOR_HTTP_PORT, HHA_INSTANCE_ID, HS_INSTANCE_ID} = require("../../src/consts")
const { call, pingConductor } = require("../../src/hc_client")


  pingConductor().then( async() =>{

  	let result = await call(HHA_INSTANCE_ID, "provider",'register_as_provider',
    {
      provider_doc: {
        kyc_proof: 'TODO: This info is currently not required.'
      }
    })
    console.log("Registed as provider", result);
    let result1=await call( HHA_INSTANCE_ID,
      "provider",
      "register_app",
      {
        app_bundle: {
          happ_hash: "QmP3SeCC6QibtEtxtpoWFjt2Jd2xA1aBURGUHUWRCNVSdC"
        },
        domain_name: {dns_name:"test@1.org"}
      })

    console.log("Registed happ 1...", result1);

    let result2=await call( HHA_INSTANCE_ID,
      "provider",
      "register_app",
      {
        app_bundle: {
          happ_hash: "QmSUCCM19jCgHf26ecJqtBmVaP3MPYsed35Xhwwq6GDLnm"
        },
        domain_name: {dns_name:"test@2.org"}
      })

    console.log("Registed happ 2...", result2);


  }).catch((e) => {throw new Error("Script not successful",e)})
